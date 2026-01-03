import React from 'react';
import ParallaxImage from '../components/ParallaxImage';

const Contact: React.FC = () => {
  return (
    <div className="pt-48 p-8 md:p-16 max-w-7xl mx-auto animate-fadeIn">
      <h1 className="text-5xl font-serif text-center mb-12 text-brown-dark">Get In Touch</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="bg-white/50 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-3xl font-serif text-brown-dark mb-6">Send Us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-grey-dark">Full Name</label>
              <input type="text" id="name" className="mt-1 block w-full bg-beige/50 border-brown-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown focus:border-brown" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-grey-dark">Email Address</label>
              <input type="email" id="email" className="mt-1 block w-full bg-beige/50 border-brown-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown focus:border-brown" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-grey-dark">Message</label>
              <textarea id="message" rows={5} className="mt-1 block w-full bg-beige/50 border-brown-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown focus:border-brown"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full bg-brown-dark text-white py-3 px-4 rounded-md hover:bg-brown transition-colors duration-300 font-semibold">
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-serif text-brown-dark mb-2">Visit Our Showroom</h3>
            <p className="text-grey-dark">Shop No. 5, Morod, Mapusa, Goa, 403507</p>
          </div>
           <div>
            <h3 className="text-2xl font-serif text-brown-dark mb-2">Contact Us</h3>
            <p className="text-grey-dark">
              <strong>Phone:</strong> +91 12345 67890<br/>
              <strong>Email:</strong> info@tiwarienterprises.com
            </p>
          </div>
           <div>
            <h3 className="text-2xl font-serif text-brown-dark mb-2">Business Hours</h3>
            <p className="text-grey-dark">
              <strong>Monday - Saturday:</strong> 9:00 AM - 6:00 PM<br/>
              <strong>Sunday:</strong> Closed
            </p>
          </div>
          <div className="h-64 rounded-lg overflow-hidden shadow-lg">
             <ParallaxImage src="https://picsum.photos/800/400?image=101" alt="Map Location" className="w-full h-full object-cover"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
