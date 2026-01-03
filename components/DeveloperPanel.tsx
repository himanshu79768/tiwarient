import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue, set, remove, update } from 'firebase/database';
import { GalleryImage } from '../types';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    reason: string;
    message: string;
    submittedAt: string;
    isRead: boolean;
}

interface DeveloperPanelProps {
  onClose: () => void;
}

interface Upload {
    name: string;
    status: 'compressing' | 'uploading' | 'failed';
}

const categories = [
  'tiles flooring',
  'stairs',
  'basin/bathroom',
  'balcony',
  'doors/windows frames',
  'kitchen',
  'garden terrace',
  'temple',
];

// UTILITY: Converts a file to a compressed blob
const compressImage = (file: File, quality = 0.8, max_width = 1024, max_height = 1024): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onerror = reject;
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onerror = reject;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > max_width) {
                        height = Math.round(height * (max_width / width));
                        width = max_width;
                    }
                } else {
                    if (height > max_height) {
                        width = Math.round(width * (max_height / height));
                        height = max_height;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Failed to get canvas context.'));
                
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas to Blob conversion failed'));
                }, 'image/jpeg', quality);
            };
        };
    });
};

// UTILITY: Converts a blob to a Base64 data URL
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onerror = reject;
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
    });
};


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            active
                ? 'bg-brown-dark text-white shadow-sm'
                : 'bg-transparent text-grey-dark hover:bg-brown-light/20'
        }`}
    >
        {children}
    </button>
);

const IconButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string, title?: string }> = ({ onClick, children, className = '', title }) => (
    <button
        onClick={onClick}
        title={title}
        className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${className}`}
    >
        {children}
    </button>
);


const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ onClose }) => {
  // Data States
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [activeTab, setActiveTab] = useState<'gallery' | 'messages'>('gallery');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<GalleryImage | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{ type: 'image' | 'message', id: string } | null>(null);
  const [uploads, setUploads] = useState<{ [key: string]: Upload }>({});


  useEffect(() => {
    // Gallery listener
    const imagesRef = dbRef(db, 'gallery');
    const unsubscribeGallery = onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();
      const imageList: GalleryImage[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setImages(imageList.reverse()); // Show newest first
      setIsLoading(false);
    });

    // Messages listener
    const messagesRef = dbRef(db, 'contacts');
    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const messageList: ContactMessage[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        messageList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        setMessages(messageList);
    });

    return () => {
      unsubscribeGallery();
      unsubscribeMessages();
    };
  }, []);
  
  // --- HANDLERS ---
    const handleAddImage = async (file: File, title: string, description: string, category: string) => {
        if (!file) return;

        const uniqueId = `img_${Date.now()}`;
        setUploads(prev => ({ ...prev, [uniqueId]: { name: file.name, status: 'compressing' } }));

        try {
            const compressedBlob = await compressImage(file);
            setUploads(prev => ({ ...prev, [uniqueId]: { ...prev[uniqueId], status: 'uploading' } }));

            const base64String = await blobToBase64(compressedBlob);
            
            await set(dbRef(db, `gallery/${uniqueId}`), {
                src: base64String,
                alt: title,
                description: description,
                category: category,
            });

            // Success, remove from uploads list
            setUploads(prev => {
                const newUploads = { ...prev };
                delete newUploads[uniqueId];
                return newUploads;
            });

        } catch (error) {
            console.error("Image processing or upload failed:", error);
            setUploads(prev => prev[uniqueId] ? { ...prev, [uniqueId]: { ...prev[uniqueId], status: 'failed' } } : prev);
        }
    };

    const handleClearUpload = (id: string) => {
        setUploads(prev => {
            const newUploads = { ...prev };
            delete newUploads[id];
            return newUploads;
        });
    };
  
  const handleUpdateImage = async (id: string, updates: Partial<GalleryImage>, newFile?: File) => {
    if (newFile) {
      try {
        const compressedBlob = await compressImage(newFile);
        updates.src = await blobToBase64(compressedBlob);
      } catch (error) {
          console.error("Failed to process new image for update:", error);
          alert("Failed to process the new image. Please try another file.");
          return;
      }
    }
    await update(dbRef(db, `gallery/${id}`), updates);
  };
  
  const handleDeleteConfirmed = async () => {
      if (!confirmModalData) return;
      const { type, id } = confirmModalData;
      if (type === 'image') {
          await remove(dbRef(db, `gallery/${id}`));
      } else if (type === 'message') {
          await remove(dbRef(db, `contacts/${id}`));
      }
      setConfirmModalData(null);
  };

  const toggleMessageReadStatus = async (message: ContactMessage) => {
    await update(dbRef(db, `contacts/${message.id}`), { isRead: !message.isRead });
  };
  
  const unreadMessagesCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-beige rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <header className="px-6 py-3 flex justify-between items-center flex-shrink-0">
            <h2 className="text-2xl font-serif text-brown-dark">Developer Panel</h2>
            <button onClick={onClose} className="text-brown-dark hover:text-accent p-2 -mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </header>

        {/* Tab Controls */}
        <div className="px-6 pb-4 border-b border-brown-light/20">
            <div className="flex items-center space-x-2">
                <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')}>Gallery</TabButton>
                <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')}>
                    Messages {unreadMessagesCount > 0 && <span className="ml-2 bg-accent text-white text-xs font-bold rounded-full px-2 py-0.5">{unreadMessagesCount}</span>}
                </TabButton>
            </div>
        </div>
        
        {/* Animated Content Area */}
        <main className="overflow-hidden flex-grow relative">
            <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeTab === 'gallery' ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-serif text-brown-dark uppercase">MANAGE GALLERY</h3>
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-brown-dark text-white hover:bg-brown transition-colors rounded-full p-2 md:px-4 md:py-2 md:rounded-full flex items-center justify-center text-sm font-semibold">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                           <span className="hidden md:block">Add New Image</span>
                        </button>
                    </div>
                     {Object.keys(uploads).length > 0 && (
                        <div className="mb-6 p-4 border rounded-md border-brown-light/20 space-y-3">
                           {Object.entries(uploads).map(([key, {name, status}]) => (
                               <div key={key} className="flex justify-between items-center text-sm p-2 bg-brown-light/10 rounded">
                                   <span className="text-grey-dark truncate pr-4">{name}</span>
                                   <div className="flex items-center gap-2">
                                        <span className={`font-medium capitalize ${status === 'failed' ? 'text-red-500' : 'text-brown-dark'}`}>
                                            {status === 'compressing' ? 'Compressing...' : status === 'uploading' ? 'Uploading...' : 'Failed'}
                                        </span>
                                        {status === 'failed' && (
                                            <button onClick={() => handleClearUpload(key)} className="text-grey-dark hover:text-red-500" title="Clear failed upload">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                               </div>
                           ))}
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {isLoading ? <p>Loading images...</p> : images.map(img => (
                        <div key={img.id} className="rounded-md shadow-md bg-white p-2 flex flex-col gap-2 text-sm">
                            <img src={img.src} alt={img.alt} className="w-full h-24 object-cover rounded-sm"/>
                            <div className="flex-grow">
                                <p className="font-semibold text-brown-dark truncate" title={img.alt}>{img.alt || 'No Title'}</p>
                                <p className="text-xs text-grey-dark truncate" title={img.description}>{img.description || 'No Description'}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-auto pt-1">
                                <IconButton onClick={() => setEditModalData(img)} title="Edit" className="bg-brown/70 hover:bg-brown text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                </IconButton>
                                <IconButton onClick={() => setConfirmModalData({ type: 'image', id: img.id })} title="Delete" className="bg-red-500 hover:bg-red-600 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </IconButton>
                            </div>
                        </div>
                        ))}
                    </div>
                 </div>
            </div>
            <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${activeTab === 'messages' ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="p-6 h-full overflow-y-auto">
                    <h3 className="text-xl font-serif text-brown-dark uppercase mb-6">CLIENT MESSAGES</h3>
                     {isLoading ? <p>Loading messages...</p> : messages.length === 0 ? <p className="text-grey-dark text-center py-8">No messages yet.</p> : (
                         <div className="space-y-4">
                             {messages.map(msg => (
                                 <div key={msg.id} className={`p-4 rounded-md shadow-sm border-l-4 transition-colors ${msg.isRead ? 'bg-white border-grey-light' : 'bg-blue-50 border-blue-500'}`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="min-w-0 flex-grow">
                                            <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
                                                <p className="font-semibold text-brown-dark truncate">{msg.name}</p>
                                                <a href={`mailto:${msg.email}`} className="text-sm text-brown hover:underline break-all">{msg.email}</a>
                                                {msg.phone && <a href={`tel:${msg.phone}`} className="text-sm text-brown hover:underline">{msg.phone}</a>}
                                            </div>
                                            <p className="text-xs text-grey-dark mt-1">
                                                {new Date(msg.submittedAt).toLocaleString()} | <span className="font-medium">Inquiry: {msg.reason}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <IconButton onClick={() => toggleMessageReadStatus(msg)} title={msg.isRead ? "Mark as Unread" : "Mark as Read"} className="text-grey-dark hover:text-brown-dark hover:bg-grey-light/50">
                                                {msg.isRead 
                                                    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19h18" /></svg>
                                                    : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12A4 4 0 108 12a4 4 0 008 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>
                                                }
                                            </IconButton>
                                             <IconButton onClick={() => setConfirmModalData({ type: 'message', id: msg.id })} title="Delete Message" className="text-red-500 hover:text-red-700 hover:bg-red-100">
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </IconButton>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-grey-dark bg-grey-light/20 p-3 rounded">{msg.message}</p>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>
            </div>
        </main>
      </div>

      {isAddModalOpen && <AddImageModal onAdd={handleAddImage} onClose={() => setIsAddModalOpen(false)} />}
      {editModalData && <EditImageModal imageData={editModalData} onUpdate={handleUpdateImage} onClose={() => setEditModalData(null)} />}
      {confirmModalData && <ConfirmationModal onConfirm={handleDeleteConfirmed} onClose={() => setConfirmModalData(null)} type={confirmModalData.type} />}
    </div>
  );
};

// --- MODAL COMPONENTS ---

const ModalWrapper: React.FC<{ children: React.ReactNode, title: string, onClose: () => void }> = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-beige rounded-lg shadow-2xl w-full max-w-md flex flex-col">
        <header className="p-4 border-b border-brown-light/20 flex justify-between items-center">
          <h3 className="text-xl font-serif text-brown-dark">{title}</h3>
          <button onClick={onClose} className="text-brown-dark hover:text-accent p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
);

const FormInput: React.FC<{ label: string } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-grey-dark mb-1">{label}</label>
        <input {...props} className="block w-full text-sm text-grey-dark bg-white border border-grey-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown focus:border-brown" />
    </div>
);

const FormTextArea: React.FC<{ label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-grey-dark mb-1">{label}</label>
        <textarea {...props} rows={3} className="block w-full text-sm text-grey-dark bg-white border border-grey-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown focus:border-brown" />
    </div>
);

const FormSelect: React.FC<{ label: string, children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>> = ({ label, children, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-grey-dark mb-1">{label}</label>
        <select {...props} className="block w-full capitalize text-sm text-grey-dark bg-white border-grey-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown focus:border-brown">
            {children}
        </select>
    </div>
);

const AddImageModal: React.FC<{ onAdd: (file: File, title: string, desc: string, cat: string) => void, onClose: () => void }> = ({ onAdd, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };
    
    const handleSubmit = () => {
        if (file && title) {
            onAdd(file, title, description, category);
            onClose();
        } else {
            alert('Please select a file and provide a title.');
        }
    };

    return (
        <ModalWrapper title="Add New Gallery Image" onClose={onClose}>
            <div className="space-y-4">
                <FormInput type="file" label="Image File" accept="image/*" onChange={handleFileChange} required />
                {preview && <img src={preview} alt="Preview" className="w-full h-32 object-contain rounded-md bg-grey-light/20" />}
                <FormInput type="text" label="Title (Alt Text)" value={title} onChange={e => setTitle(e.target.value)} required />
                <FormTextArea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <FormSelect label="Category" value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </FormSelect>
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md bg-grey-light hover:bg-grey/50 text-grey-dark transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={!file || !title} className="px-4 py-2 text-sm font-semibold rounded-md bg-brown-dark text-white hover:bg-brown transition-colors disabled:bg-brown-light disabled:cursor-not-allowed">Upload Image</button>
                </div>
            </div>
        </ModalWrapper>
    );
};


const EditImageModal: React.FC<{ imageData: GalleryImage, onUpdate: (id: string, updates: Partial<GalleryImage>, newFile?: File) => void, onClose: () => void }> = ({ imageData, onUpdate, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(imageData.src);
    const [title, setTitle] = useState(imageData.alt || '');
    const [description, setDescription] = useState(imageData.description || '');
    const [category, setCategory] = useState(imageData.category || categories[0]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };
    
    const handleSubmit = () => {
        if (!title) {
            alert('Title cannot be empty.');
            return;
        }
        const updates: Partial<GalleryImage> = {};
        if (title !== imageData.alt) updates.alt = title;
        if (description !== imageData.description) updates.description = description;
        if (category !== imageData.category) updates.category = category;
        
        onUpdate(imageData.id, updates, file || undefined);
        onClose();
    };

    return (
        <ModalWrapper title="Edit Gallery Image" onClose={onClose}>
            <div className="space-y-4">
                <FormInput type="file" label="Replace Image (Optional)" accept="image/*" onChange={handleFileChange} />
                <img src={preview} alt="Preview" className="w-full h-32 object-contain rounded-md bg-grey-light/20" />
                <FormInput type="text" label="Title (Alt Text)" value={title} onChange={e => setTitle(e.target.value)} required />
                <FormTextArea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <FormSelect label="Category" value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </FormSelect>
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md bg-grey-light hover:bg-grey/50 text-grey-dark transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold rounded-md bg-brown-dark text-white hover:bg-brown transition-colors">Save Changes</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

const ConfirmationModal: React.FC<{ onConfirm: () => void, onClose: () => void, type: 'image' | 'message' }> = ({ onConfirm, onClose, type }) => (
    <ModalWrapper title={`Confirm Deletion`} onClose={onClose}>
        <p className="text-grey-dark mb-6">Are you sure you want to permanently delete this {type}? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md bg-grey-light hover:bg-grey/50 text-grey-dark transition-colors">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
        </div>
    </ModalWrapper>
);

export default DeveloperPanel;