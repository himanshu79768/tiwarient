import React, { useState, useEffect } from 'react';
import ParallaxImage from '../components/ParallaxImage';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

interface Testimonial {
  quote: string;
  author: string;
}

const ProjectCard: React.FC<{ title: string; location: string; imageUrl: string }> = ({ title, location, imageUrl }) => (
  <div className="group relative overflow-hidden rounded-lg shadow-lg">
    <ParallaxImage src={imageUrl} alt={title} className="w-full h-80 object-cover transform transition-transform duration-500"/>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-6 text-white">
      <h3 className="text-2xl font-serif">{title}</h3>
      <p className="text-sm opacity-80">{location}</p>
    </div>
  </div>
);

const TestimonialCard: React.FC<Testimonial> = ({ quote, author }) => (
  <div className="bg-white/60 p-8 rounded-lg shadow-md backdrop-blur-sm h-full">
    <p className="text-lg italic text-grey-dark mb-4">"{quote}"</p>
    <p className="font-semibold text-right text-brown-dark">- {author}</p>
  </div>
);


const Experience: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = ref(db, 'testimonials');
        const snapshot = await get(testimonialsRef);
        if (snapshot.exists()) {
          // Firebase returns an object, so we convert it to an array
          const data = snapshot.val();
          const testimonialsList = Object.keys(data).map(key => data[key]);
          setTestimonials(testimonialsList);
        } else {
          console.log("No testimonial data available");
        }
      } catch (error) {
        console.error("Error fetching testimonials: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="animate-fadeIn pt-48">
      <section className="p-8 md:p-16 max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif text-center mb-12 text-brown-dark">Our Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard title="Luxury Villa Flooring" location="Assagao, Goa" imageUrl="https://picsum.photos/600/800?image=1074" />
          <ProjectCard title="Modern Bathroom Renovation" location="Siolim, Goa" imageUrl="https://picsum.photos/600/800?image=659" />
          <ProjectCard title="Commercial Plumbing System" location="Mapusa, Goa" imageUrl="https://picsum.photos/600/800?image=56" />
        </div>
      </section>

      <section className="py-16 bg-brown-light/20">
        <div className="p-8 md:p-16 max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif text-center mb-12 text-brown-dark">What Our Clients Say</h2>
          {loading ? (
            <p className="text-center">Loading testimonials...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Experience;