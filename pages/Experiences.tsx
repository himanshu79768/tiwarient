import React, { useState, useEffect, useRef } from 'react';
import ParallaxImage from '../components/ParallaxImage';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

interface Testimonial {
  quote: string;
  author: string;
}

// Custom hook to detect when an element is in view
const useInView = (ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return isInView;
};

// Typing animation component
const TypingText: React.FC<{ text: string; speed?: number; className?: string }> = ({ text, speed = 30, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { threshold: 0.5 });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isInView && text) {
      // Reset animation state when it comes into view
      setDisplayedText('');
      setIsFinished(false);
      
      const intervalId = setInterval(() => {
        setDisplayedText(current => {
          if (current.length < text.length) {
            return text.substring(0, current.length + 1);
          }
          // When we reach the end, clear interval and mark as finished
          clearInterval(intervalId);
          setIsFinished(true);
          return text;
        });
      }, speed);

      // Effect cleanup
      return () => clearInterval(intervalId);
    }
  }, [isInView, text, speed]);

  const isTyping = isInView && !isFinished;

  return (
    <p ref={ref} className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </p>
  );
};

const ServiceCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="p-6 h-full bg-white/50 rounded-lg shadow-md backdrop-blur-sm">
    <div className="flex justify-center items-center mb-4 text-brown h-12 w-12 mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-serif text-brown-dark mb-2 text-left md:text-center">{title}</h3>
    <p className="text-grey-dark font-light text-sm text-left md:text-center">{description}</p>
  </div>
);

const ProjectCard: React.FC<{ title: string; description: string; imageUrl: string }> = ({ title, description, imageUrl }) => (
  <div className="group relative overflow-hidden rounded-lg shadow-lg">
    <ParallaxImage src={imageUrl} alt={title} className="w-full h-80 object-cover transform transition-transform duration-500"/>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-6 text-white">
      <h3 className="text-2xl font-serif">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  </div>
);

const TestimonialCard: React.FC<Testimonial> = ({ quote, author }) => (
  <div className="bg-white/60 p-8 rounded-lg shadow-md backdrop-blur-sm h-full flex flex-col">
    <div className="flex-grow min-h-[120px]">
      <TypingText text={`"${quote}"`} className="text-lg italic text-grey-dark mb-4" speed={15} />
    </div>
    <p className="font-semibold text-right text-brown-dark">- {author}</p>
  </div>
);


const Experiences: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = ref(db, 'testimonials');
        const snapshot = await get(testimonialsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const testimonialsList = Object.keys(data).map(key => data[key]);
          setTestimonials(testimonialsList);
        } else {
          console.log("No testimonial data available");
          setTestimonials([
            { quote: "The quality and finish are exceptional. Tiwari Enterprises transformed our home!", author: "A. Sharma" },
            { quote: "Professional team and a fantastic selection of tiles. Highly recommended.", author: "R. Fernandes" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching testimonials: ", error);
         setTestimonials([
            { quote: "The quality and finish are exceptional. Tiwari Enterprises transformed our home!", author: "A. Sharma" },
            { quote: "Professional team and a fantastic selection of tiles. Highly recommended.", author: "R. Fernandes" }
          ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <>
      <div className="animate-fadeIn pt-28 p-8 md:px-16 max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif text-center mb-16 text-brown-dark">Our Experiences</h1>
        
        {/* Our Services Section */}
        <section>
           <div className="max-w-3xl mx-auto text-center md:text-left">
              <h2 className="text-2xl font-serif text-brown-dark uppercase mb-4 text-left">Our Services</h2>
             
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                  title="Interior Design"
                  description="Professional interior design and space planning that blends modern aesthetics with traditional Goan charm and functionality."
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 9.77746V16.2C5 17.8802 5 18.7203 5.32698 19.362C5.6146 19.9265 6.07354 20.3854 6.63803 20.673C7.27976 21 8.11984 21 9.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7203 19 17.8802 19 16.2V5.00002M21 12L15.5668 5.96399C14.3311 4.59122 13.7133 3.90484 12.9856 3.65144C12.3466 3.42888 11.651 3.42893 11.0119 3.65159C10.2843 3.90509 9.66661 4.59157 8.43114 5.96452L3 12" />
                  </svg>}
              />
              <ServiceCard
                  title="Renovation"
                  description="Home and office renovation and remodeling services to modernize and upgrade your existing spaces with contemporary designs."
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.6316 7.63137C15.2356 7.23535 15.0376 7.03735 14.9634 6.80902C14.8981 6.60817 14.8981 6.39183 14.9634 6.19098C15.0376 5.96265 15.2356 5.76465 15.6316 5.36863L18.47 2.53026C17.7168 2.18962 16.8806 2 16.0002 2C12.6865 2 10.0002 4.68629 10.0002 8C10.0002 8.49104 10.0592 8.9683 10.1705 9.42509C10.2896 9.91424 10.3492 10.1588 10.3387 10.3133C10.3276 10.4751 10.3035 10.5612 10.2289 10.7051C10.1576 10.8426 10.0211 10.9791 9.74804 11.2522L3.50023 17.5C2.6718 18.3284 2.6718 19.6716 3.50023 20.5C4.32865 21.3284 5.6718 21.3284 6.50023 20.5L12.748 14.2522C13.0211 13.9791 13.1576 13.8426 13.2951 13.7714C13.4391 13.6968 13.5251 13.6727 13.6869 13.6616C13.8414 13.651 14.086 13.7106 14.5751 13.8297C15.0319 13.941 15.5092 14 16.0002 14C19.3139 14 22.0002 11.3137 22.0002 8C22.0002 7.11959 21.8106 6.28347 21.47 5.53026L18.6316 8.36863C18.2356 8.76465 18.0376 8.96265 17.8092 9.03684C17.6084 9.1021 17.3921 9.1021 17.1912 9.03684C16.9629 8.96265 16.7649 8.76465 16.3689 8.36863L15.6316 7.63137Z"/>
                  </svg>}
              />
              <ServiceCard
                  title="Consultation"
                  description="Expert architectural and design consultation services to help you plan and execute your construction or renovation project effectively."
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7C9.23858 7 7 9.23858 7 12C7 13.3613 7.54402 14.5955 8.42651 15.4972C8.77025 15.8484 9.05281 16.2663 9.14923 16.7482L9.67833 19.3924C9.86537 20.3272 10.6862 21 11.6395 21H12.3605C13.3138 21 14.1346 20.3272 14.3217 19.3924L14.8508 16.7482C14.9472 16.2663 15.2297 15.8484 15.5735 15.4972C16.456 14.5955 17 13.3613 17 12C17 9.23858 14.7614 7 12 7Z" />
                    <path d="M12 4V3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 6L19 5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 12H21" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12H3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5L6 6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17H14" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>}
              />
          </div>
        </section>

        {/* Our Portfolio Section */}
        <section className="py-16">
          <h2 className="text-2xl font-serif text-brown-dark uppercase mb-12 text-left md:text-left">Our Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard title="Living Space" description="Elegant living area with premium flooring." imageUrl="https://iili.io/fjPj3kF.md.jpg" />
            <ProjectCard title="Temple" description="Intricate marble work for a serene temple space." imageUrl="https://iili.io/fjPwznj.md.jpg" />
            <ProjectCard title="Kitchen" description="Modern kitchen with custom tiling and fixtures." imageUrl="https://iili.io/fjPNmLG.jpg" />
            <ProjectCard title="Stairs" description="Stylish staircase featuring durable materials." imageUrl="https://iili.io/fjPCkNf.md.jpg" />
          </div>
        </section>
      </div>

      {/* Testimonials Section */}
      <section className="py-16 bg-brown-light/20">
        <div className="p-8 md:px-16 max-w-7xl mx-auto">
          <h2 className="text-2xl font-serif text-brown-dark uppercase mb-12 text-left md:text-left">What Our Clients Say</h2>
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
    </>
  );
};

export default Experiences;