
import React, { useState, useRef, useEffect } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className = '', strength = 0.2 }) => {
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elementIsInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (elementIsInView) {
          const distanceToCenter = window.innerHeight / 2 - rect.top;
          const parallaxOffset = distanceToCenter * strength;
          setOffsetY(parallaxOffset);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [strength]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto object-cover transition-transform duration-200 ease-out"
        style={{ 
          transform: `translateY(${offsetY}px) scale(1.2)`, // Scale up to avoid edges
          willChange: 'transform' // Performance optimization
        }}
      />
    </div>
  );
};

export default ParallaxImage;