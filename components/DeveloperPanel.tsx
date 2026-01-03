import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../firebase';
import { ref as dbRef, onValue, set, remove, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface DeveloperPanelProps {
  onClose: () => void;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ onClose }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
      const newImageId = `img_${Date.now()}`;
      const imageStorageRef = storageRef(storage, `gallery/${newImageId}_${file.name}`);
      
      await uploadBytes(imageStorageRef, file);
      const downloadURL = await getDownloadURL(imageStorageRef);

      const imageDbRef = dbRef(db, `gallery/${newImageId}`);
      await set(imageDbRef, {
        src: downloadURL,
        alt: 'A new gallery image'
      });
    } catch (error) {
      console.error("Error uploading image:", error);
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

  const handleDelete = async (image: GalleryImage) => {
    if (window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      try {
        // Delete from Storage
        const imageStorageRef = storageRef(storage, image.src);
        await deleteObject(imageStorageRef);

        // Delete from Realtime Database
        const imageDbRef = dbRef(db, `gallery/${image.id}`);
        await remove(imageDbRef);
      } catch(error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. It might have already been removed from storage. Deleting database entry.");
        // If storage fails (e.g. file not found), still try to delete from DB
        const imageDbRef = dbRef(db, `gallery/${image.id}`);
        await remove(imageDbRef);
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-grey-dark mb-2">Upload New Image</label>
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-grey-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brown-light/20 file:text-brown-dark hover:file:bg-brown-light/40 disabled:opacity-50"
            />
            {uploading && <p className="text-sm text-brown mt-2">Uploading...</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? <p>Loading images...</p> : images.map(img => (
              <div key={img.id} className="relative group rounded-md overflow-hidden shadow-md">
                <img src={img.src} alt={img.alt} className="w-full h-40 object-cover"/>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                  <p className="text-xs truncate" title={img.alt}>{img.alt}</p>
                  <div className="flex justify-end gap-2 mt-1">
                    <button onClick={() => handleEditAlt(img.id, img.alt)} className="bg-blue-500 hover:bg-blue-600 text-white text-xs p-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(img)} className="bg-red-500 hover:bg-red-600 text-white text-xs p-1 rounded">Delete</button>
                  </div>
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