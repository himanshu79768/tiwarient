import React, { useState, useEffect } from 'react';
import ParallaxImage from '../components/ParallaxImage';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(db, 'gallery');
        const snapshot = await get(imagesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert Firebase object to an array for rendering
          const imageList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setImages(imageList);
        } else {
          console.log("No gallery data available");
        }
      } catch (error) {
        console.error("Error fetching gallery images: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="pt-48 p-8 md:p-16 max-w-7xl mx-auto animate-fadeIn">
      <h1 className="text-5xl font-serif text-center mb-12 text-brown-dark">Our Work</h1>
      {loading ? (
        <p className="text-center">Loading gallery...</p>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-lg">
              <ParallaxImage 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;