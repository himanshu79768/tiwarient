import React from 'react';
import ParallaxImage from '../components/ParallaxImage';

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="text-center">
    <div className="flex justify-center items-center mb-4 text-brown h-12 w-12 mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-serif text-brown-dark mb-2">{title}</h3>
    <p className="text-grey-dark font-light text-sm">{description}</p>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      {/* Immersive Hero Video Section */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        <video
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="text-center z-10 p-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif font-light text-white/90 mb-4 tracking-wide">
            Elevating Living 
            <span className="block mt-3">
              Via <span className="italic">Goan</span> Craftsmanship
            </span>
          </h1>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-center text-white">
          <p className="font-sans text-xs tracking-widest mb-4">SCROLL TO EXPLORE</p>
          <div className="w-px h-16 mx-auto bg-white/20 overflow-hidden relative">
            <div className="w-full h-full bg-white absolute top-0 left-0 animate-scroll-down-line"></div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xs text-brown tracking-widest mb-4">MAKING MEMORIES</h2>
            <p className="text-2xl font-serif text-brown-dark mb-6">
              A FOUNDATION OF QUALITY FOR A LIFETIME OF MOMENTS.
            </p>
            <p className="text-grey-dark leading-relaxed">
              At Tiwari Enterprises, we believe a home is more than just a structure; it's the backdrop for your life's most precious memories. From the ground up, we provide the finest materials and expert solutions to ensure your space is not only beautiful but also built to last.
            </p>
        </div>
      </section>
      
      {/* Image Showcase Section */}
       <section className="px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-8">
            <ParallaxImage src="https://iili.io/fjLP1DJ.md.jpg" alt="Kitchen Tiling" className="rounded-md shadow-lg w-full"/>
          </div>
          <div className="space-y-8 md:pt-24">
             <ParallaxImage src="https://iili.io/fjLiN1V.md.jpg" alt="Bathroom Fixtures" className="rounded-md shadow-lg w-full"/>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-serif text-brown-dark uppercase mb-12 md:mb-16">The Tiwari Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
            <FeatureCard
              title="Unrivaled Selection"
              description="Explore a curated collection of the world's finest tiles, flooring, and plumbing fixtures."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>}
            />
            <FeatureCard
              title="Expert Craftsmanship"
              description="Our experienced team ensures flawless installation and meticulous attention to every detail."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 15.17l-2.472 2.472a3.375 3.375 0 004.773 4.773l2.472-2.472z" /></svg>}
            />
            <FeatureCard
              title="Lasting Relationships"
              description="We are committed to exceptional service and building trust with every client we serve."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75S9.75 9.336 9.75 9.75zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" /></svg>}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
