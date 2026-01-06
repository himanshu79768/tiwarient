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
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto z-0 transform -translate-x-1/2 -translate-y-1/2 object-cover"
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
              description="Explore a curated collection of the finest tiles, flooring, construction and interior designing."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>}
            />
            <FeatureCard
              title="Expert Craftsmanship"
              description="Our experienced team ensures flawless installation and meticulous attention to every detail."
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="currentColor">
                <path d="M1.9205 50.6968L5.3687 54.145C7.2673 56 9.4279 55.8472 11.3484 53.7303L34.1981 28.8511c.9384.6547 1.8113.6329 2.8807.4147l2.3352-.4802 1.5496 1.5495-.1091 1.1567c-.1528 1.2003.1963 2.1169 1.3092 3.2299l1.8334 1.8114c1.1129 1.1348 2.5968 1.2003 3.6663.1309l7.2675-7.2673c1.0691-1.0694 1.0038-2.5316-.1091-3.6664l-1.8334-1.8332c-1.1129-1.1131-2.0515-1.5059-3.2301-1.3313l-1.1782.1309-1.4843-1.484.6548-2.5534c.3057-1.2657-.0219-2.2915-1.3967-3.6446l-5.3903-5.3686c-7.9222-7.8784-18.0703-7.6384-25.0104-.6329-.9602.9602-1.0475 2.2697-.4364 3.2299.5019.8293 1.5713 1.3313 3.0335.9603 3.3827-.8512 6.7654-.5893 10.0827 1.6586l-1.3968 3.5355c-.5238 1.3094-.4801 2.3787.0437 3.3608L2.3352 44.7171C.2401 46.6594 0 48.7763 1.9205 50.6968ZM19.4233 9.8861c5.9579-4.452 13.378-3.7319 18.7467 1.6368l5.8704 5.827c.5239.5238.5896.9384.4367 1.5932l-.8291 3.4918 3.5135 3.5136 2.1387-.1964c.6329-.0655.8291-.0218 1.3529.4801l1.3753 1.3968-6.1327 6.1543-1.3967-1.3967c-.5019-.5019-.5456-.6984-.4799-1.3313l.1962-2.1606-3.4916-3.4918-3.623.6984c-.6329.1309-.9602.1309-1.5058-.4147l-4.8449-4.8667c-.5238-.5238-.5893-.8293-.3056-1.5277l2.1388-5.1067c-3.5791-3.4264-8.3149-5.3251-12.8761-3.8629-.1964.0655-.3274.0218-.3928-.0655-.0655-.1091-.0655-.2182.1091-.371zM4.7576 49.1255c-1.113-1.113-.7202-1.7896.0218-2.4661l24.5083-22.6095 2.7279 2.7497L9.3406 51.2206c-.6765.742-1.5276.9602-2.4442.0655z"/>
              </svg>}
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
