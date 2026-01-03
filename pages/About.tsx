import React, { useState, useEffect, useRef } from 'react';
import ParallaxImage from '../components/ParallaxImage';

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


// Animated Counter Component
const AnimatedCounter: React.FC<{ target: number, duration?: number }> = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { threshold: 0.5 });
  // FIX: The useRef hook was called without an initial value, which is required.
  // I've passed `undefined` to correctly initialize it as a mutable ref that can hold a number or be undefined.
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const currentCount = Math.min(target, Math.floor((progress / duration) * target));
        setCount(currentCount);

        if (progress < duration) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
};


const About: React.FC = () => {
  return (
    <div className="pt-48 animate-fadeIn">
      {/* Header section */}
      <section className="p-8 md:px-16 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-serif mb-4 text-brown-dark">About Tiwari Enterprises</h1>
        <p className="text-xl text-grey-dark max-w-3xl mx-auto font-light">
          Your trusted partner for construction and interior design in Mapusa, Goa
        </p>
      </section>

      {/* Main content and image section */}
      <section className="px-8 md:px-16 max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 text-grey-dark leading-relaxed">
            <h2 className="text-3xl font-serif text-brown-dark">Excellence in Every Project</h2>
            <p>
              Since our establishment in Mapusa, Tiwari Enterprises has been at the forefront of construction and interior design services in Goa. We specialize in creating beautiful, functional spaces that combine modern design principles with the unique architectural heritage of Goa.
            </p>
            <p>
              Our experienced team understands the local climate, regulations, and cultural preferences, ensuring every project we undertake is perfectly suited to its Goan environment. From traditional Portuguese-inspired homes to contemporary commercial spaces, we deliver excellence in every project.
            </p>
          </div>

          {/* Image */}
          <div>
            <ParallaxImage src="/hero.jpeg" alt="Tiwari Enterprises Goa Project" className="rounded-lg shadow-2xl w-full h-[450px] object-cover"/>
          </div>
        </div>
      </section>

      {/* Stats Card Section */}
      <section className="px-8 md:px-16 pb-20">
        <div className="max-w-5xl mx-auto bg-white/50 p-8 md:p-12 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Stat 1 */}
            <div>
              <h3 className="text-4xl md:text-5xl font-serif text-brown-dark font-bold">
                <AnimatedCounter target={450} />+
              </h3>
              <p className="mt-2 text-sm text-grey-dark tracking-wider uppercase">Projects Completed</p>
            </div>
            
            {/* Stat 2 */}
            <div>
              <h3 className="text-4xl md:text-5xl font-serif text-brown-dark font-bold">
                <AnimatedCounter target={15} />+
              </h3>
              <p className="mt-2 text-sm text-grey-dark tracking-wider uppercase">Years Experience</p>
            </div>

            {/* Stat 3 */}
            <div>
              <h3 className="text-4xl md:text-5xl font-serif text-brown-dark font-bold">
                <AnimatedCounter target={98} />%
              </h3>
              <p className="mt-2 text-sm text-grey-dark tracking-wider uppercase">Client Satisfaction</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;