import React, { useState, useRef, useEffect } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className = '', strength = 0.15 }) => {
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = 1.15; // Use a slightly more subtle zoom to avoid distortion

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elementIsInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (elementIsInView) {
          // Calculate parallax based on the distance between the element's center and the viewport's center
          const distanceToCenter = (window.innerHeight / 2) - (rect.top + rect.height / 2);
          let parallaxOffset = distanceToCenter * strength;

          // Clamp the offset to ensure the scaled image edges are never visible
          const maxOffset = (rect.height * (scale - 1)) / 2;
          parallaxOffset = Math.max(-maxOffset, Math.min(maxOffset, parallaxOffset));
          
          setOffsetY(parallaxOffset);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [strength]); // Rerun effect if strength changes

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto object-cover transition-transform duration-200 ease-out"
        style={{ 
          transform: `translateY(${offsetY}px) scale(${scale})`,
          willChange: 'transform' // Performance optimization
        }}
      />
    </div>
  );
};

export default ParallaxImage;