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
      <TypingText text={`"${quote}"`} className="text-lg italic text-grey-dark mb-4" />
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
              <p className="text-grey-dark leading-relaxed mb-12 text-left">
                  Comprehensive construction and design solutions tailored for Goa's unique requirements.
              </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                  title="Interior Design"
                  description="Professional interior design and space planning that blends modern aesthetics with traditional Goan charm and functionality."
                  icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h18m-1.5 18V5.25A2.25 2.25 0 0019.5 3h-15A2.25 2.25 0 002.25 5.25V21" /></svg>}
              />
              <ServiceCard
                  title="Renovation"
                  description="Home and office renovation and remodeling services to modernize and upgrade your existing spaces with contemporary designs."
                  icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 15.17l-2.472 2.472a3.375 3.375 0 004.773 4.773l2.472-2.472z" /></svg>}
              />
              <ServiceCard
                  title="Consultation"
                  description="Expert architectural and design consultation services to help you plan and execute your construction or renovation project effectively."
                  icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
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