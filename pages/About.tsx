import { useState } from "react";
import ParallaxImage from '../components/ParallaxImage';

const About: React.FC = () => {
  return (
    <div className="pt-48 p-8 md:p-16 max-w-7xl mx-auto animate-fadeIn">
      <h1 className="text-5xl font-serif text-center mb-12 text-brown-dark">About Tiwari Enterprises</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <ParallaxImage src="https://picsum.photos/800/600?image=225" alt="Tiwari Enterprises Showroom" className="rounded-lg shadow-2xl w-full h-auto object-cover"/>
        </div>
        <div className="space-y-6 text-lg text-grey-dark font-light">
          <p>
            Founded with a vision to bring quality and elegance to homes and businesses in Goa, Tiwari Enterprises has grown to become a leading name in flooring, tiles, and plumbing solutions. Our showroom in Mapusa is a testament to our commitment to variety and excellence.
          </p>
          <h3 className="text-3xl font-serif text-brown-dark pt-4">Our Mission</h3>
          <p>
            Our mission is to provide our clients with not only the best materials but also expert guidance and flawless installation. We believe in building lasting relationships based on trust, integrity, and the shared goal of creating beautiful, functional spaces.
          </p>
          <h3 className="text-3xl font-serif text-brown-dark pt-4">Why Choose Us?</h3>
          <ul className="list-disc list-inside space-y-2 text-brown">
            <li><span className="text-grey-dark">Unmatched selection of premium materials.</span></li>
            <li><span className="text-grey-dark">Decades of combined experience in the industry.</span></li>
            <li><span className="text-grey-dark">A dedicated team of skilled professionals.</span></li>
            <li><span className="text-grey-dark">Customer-centric approach from consultation to completion.</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
