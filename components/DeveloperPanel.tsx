import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref as dbRef, onValue, set, remove, update } from 'firebase/database';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

interface DeveloperPanelProps {
  onClose: () => void;
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

const compressImage = (file: File, quality = 0.85, max_width = 1280, max_height = 1280): Promise<string> => {
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
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
        };
    });
};


const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ onClose }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newImageCategory, setNewImageCategory] = useState(categories[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const imagesRef = dbRef(db, 'gallery');
    const unsubscribe = onValue(imagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const imageList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setImages(imageList);
      } else {
        setImages([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const compressedBase64 = await compressImage(file);
      const newImageId = `img_${Date.now()}`;
      const imageDbRef = dbRef(db, `gallery/${newImageId}`);
      
      await set(imageDbRef, {
        src: compressedBase64,
        alt: 'A new gallery image',
        category: newImageCategory,
      });

    } catch (error) {
      console.error("Error compressing or uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleEditAlt = async (id: string, currentAlt: string) => {
    const newAlt = prompt("Enter new alt text:", currentAlt);
    if (newAlt !== null && newAlt.trim() !== "") {
       const imageDbRef = dbRef(db, `gallery/${id}`);
       await update(imageDbRef, { alt: newAlt });
    }
  };

  const handleCategoryChange = async (id: string, category: string) => {
    const imageDbRef = dbRef(db, `gallery/${id}`);
    await update(imageDbRef, { category });
  };

  const handleDelete = async (image: GalleryImage) => {
    if (window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      try {
        const imageDbRef = dbRef(db, `gallery/${image.id}`);
        await remove(imageDbRef);
      } catch(error) {
        console.error("Error deleting image from database:", error);
        alert("Failed to delete image.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-beige rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <header className="p-4 border-b border-brown-light/20 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-brown-dark">Developer Panel</h2>
          <button onClick={onClose} className="text-brown-dark hover:text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <h3 className="text-xl font-serif text-brown-dark mb-4">Manage Gallery</h3>
          <div className="mb-6 p-4 border rounded-md border-brown-light/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-grey-dark mb-2">Upload New Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-grey-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brown-light/20 file:text-brown-dark hover:file:bg-brown-light/40 disabled:opacity-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-grey-dark mb-2">Category</label>
                    <select
                        value={newImageCategory}
                        onChange={(e) => setNewImageCategory(e.target.value)}
                        disabled={uploading}
                        className="block w-full capitalize text-sm text-grey-dark bg-white border-grey-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown focus:border-brown"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            {uploading && <p className="text-sm text-brown mt-4">Uploading...</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? <p>Loading images...</p> : images.map(img => (
              <div key={img.id} className="rounded-md shadow-md bg-white p-2 flex flex-col gap-2 text-sm">
                <img src={img.src} alt={img.alt} className="w-full h-24 object-cover rounded-sm"/>
                <p className="text-xs truncate font-medium text-grey-dark flex-grow" title={img.alt}>{img.alt}</p>
                <select 
                    value={img.category || categories[0]} 
                    onChange={(e) => handleCategoryChange(img.id, e.target.value)}
                    className="w-full text-xs p-1 border border-grey-light rounded capitalize bg-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex justify-end gap-1 mt-auto pt-1">
                  <button onClick={() => handleEditAlt(img.id, img.alt)} className="bg-brown/70 hover:bg-brown text-white text-xs py-1 px-2 rounded">Alt</button>
                  <button onClick={() => handleDelete(img)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPanel;