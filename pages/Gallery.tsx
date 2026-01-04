import React, { useState, useEffect } from 'react';
import ParallaxImage from '../components/ParallaxImage';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  description: string;
  category: string;
}

const categoryOrder = [
  'tiles flooring',
  'stairs',
  'basin/bathroom',
  'balcony',
  'doors/windows frames',
  'kitchen',
  'garden terrace',
  'temple',
];

const Lightbox: React.FC<{ image: GalleryImage | null; onClose: () => void }> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white text-4xl hover:opacity-80 transition-opacity z-10"
        onClick={onClose}
        aria-label="Close image view"
      >
        &times;
      </button>
      <div 
        className="relative max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image container
      >
        <img 
          src={image.src} 
          alt={image.alt} 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
          <h3 className="text-white text-xl font-serif">{image.alt}</h3>
          <p className="text-white/80 text-sm">{image.description}</p>
        </div>
      </div>
    </div>
  );
};


const GalleryCard: React.FC<{ image: GalleryImage; onClick: () => void }> = ({ image, onClick }) => (
    <button onClick={onClick} className="group relative block w-full aspect-[4/3] overflow-hidden rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-beige">
        <ParallaxImage 
            src={image.src} 
            alt={image.alt} 
            className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <h3 className="text-xl font-serif text-left">{image.alt}</h3>
            <p className="text-sm opacity-80 text-left">{image.description}</p>
        </div>
    </button>
);


const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [groupedImages, setGroupedImages] = useState<Record<string, GalleryImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const imagesRef = ref(db, 'gallery');
        const snapshot = await get(imagesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const imageList: GalleryImage[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setImages(imageList);

          const grouped = imageList.reduce((acc, image) => {
            const category = image.category || 'uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(image);
            return acc;
          }, {} as Record<string, GalleryImage[]>);
          setGroupedImages(grouped);
        } else {
          setImages([]);
          setGroupedImages({});
        }
      } catch (error) {
        console.error("Error fetching gallery images: ", error);
        setImages([]);
        setGroupedImages({});
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);
  
  const orderedCategories = categoryOrder.filter(c => groupedImages[c]?.length > 0);
  if (groupedImages.uncategorized?.length > 0) {
      orderedCategories.push('uncategorized');
  }

  const filterCategories = ['All', ...orderedCategories];

  const imagesToDisplay = selectedCategory === 'All' 
    ? orderedCategories.flatMap(cat => groupedImages[cat]) 
    : groupedImages[selectedCategory] || [];

  return (
    <>
      <div className="pt-28 p-8 md:p-16 md:pt-36 max-w-7xl mx-auto animate-fadeIn">
        <h1 className="text-5xl font-serif text-center mb-12 text-brown-dark">Our Gallery</h1>
        
        {loading ? (
          <p className="text-center text-grey-dark">Loading gallery...</p>
        ) : images.length === 0 ? (
           <p className="text-center text-grey-dark">The gallery is currently empty. Please check back later.</p>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {filterCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 text-sm font-semibold tracking-wider rounded-md transition-all duration-300 capitalize shadow-md ${
                      selectedCategory === category
                          ? 'bg-brown-dark text-white scale-105'
                          : 'bg-white/80 hover:bg-brown-light/40 text-brown-dark'
                  }`}
                >
                  {category === 'uncategorized' ? 'Other Projects' : category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {imagesToDisplay.map((image) => (
                <GalleryCard 
                  key={image.id}
                  image={image}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
};

export default Gallery;