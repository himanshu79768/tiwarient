import React, { useState, useEffect } from 'react';
import ParallaxImage from '../components/ParallaxImage';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
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

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [groupedImages, setGroupedImages] = useState<Record<string, GalleryImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const imagesRef = ref(db, 'gallery');
        const snapshot = await get(imagesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const imageList: GalleryImage[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setImages(imageList);

          const grouped = imageList.reduce((acc, image) => {
            const category = image.category || 'uncategorized';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(image);
            return acc;
          }, {} as Record<string, GalleryImage[]>);
          setGroupedImages(grouped);

        } else {
          console.log("No gallery data available");
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
  
  const orderedCategories = categoryOrder.filter(c => groupedImages[c] && groupedImages[c].length > 0);
  if (groupedImages.uncategorized && groupedImages.uncategorized.length > 0) {
      orderedCategories.push('uncategorized');
  }

  const pillCategories = ['All', ...orderedCategories];

  return (
    <div className="pt-48 p-8 md:p-16 max-w-7xl mx-auto animate-fadeIn">
      <h1 className="text-5xl font-serif text-center mb-12 text-brown-dark">Our Work</h1>
      
      {loading ? (
        <p className="text-center text-grey-dark">Loading gallery...</p>
      ) : images.length === 0 ? (
         <p className="text-center text-grey-dark">The gallery is currently empty. Please check back later.</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {pillCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors capitalize shadow-sm ${
                    selectedCategory === category
                        ? 'bg-brown-dark text-white'
                        : 'bg-white/80 hover:bg-brown-light/40 text-brown-dark'
                }`}
              >
                {category === 'uncategorized' ? 'Other Projects' : category}
              </button>
            ))}
          </div>

          <div className="space-y-12">
            {selectedCategory === 'All' 
              ? orderedCategories.map(category => (
                  <section key={category}>
                    <h2 className="text-3xl font-serif text-brown-dark mb-8 capitalize">
                      {category === 'uncategorized' ? 'Other Projects' : category}
                    </h2>
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                      {groupedImages[category].map((image) => (
                        <div key={image.id} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-lg">
                          <ParallaxImage 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              : groupedImages[selectedCategory] && (
                  <section>
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                      {groupedImages[selectedCategory].map((image) => (
                        <div key={image.id} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-lg">
                          <ParallaxImage 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                )
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;