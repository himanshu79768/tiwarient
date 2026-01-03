import React, { useState } from 'react';
import ParallaxImage from '../components/ParallaxImage';
import { db } from '../firebase';
import { ref, push, set } from 'firebase/database';
import Toast from '../components/Toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'Interior Design',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToastMessage('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const contactsRef = ref(db, 'contacts');
      const newContactRef = push(contactsRef);
      await set(newContactRef, {
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      setToastMessage('Thank you! Your message has been sent.');
      setFormData({ name: '', email: '', phone: '', reason: 'Interior Design', message: '' });
    } catch (error) {
      console.error("Error submitting form: ", error);
      setToastMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <div className="pt-48 p-8 md:p-16 max-w-7xl mx-auto animate-fadeIn">
        <h1 className="text-5xl font-serif text-center mb-16 text-brown-dark">Contact us</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Details Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-brown-dark mb-6 uppercase">Get In Touch</h2>
            <div>
              <h3 className="text-xl font-serif text-brown-dark mb-2">Visit Our Showroom</h3>
              <p className="text-grey-dark">Khorlim, Mapusa, Goa, 403507.</p>
            </div>
            <div>
              <h3 className="text-xl font-serif text-brown-dark mb-2">Contact Us</h3>
              <p className="text-grey-dark">
                <strong>Phone:</strong> +91 9049600466<br />
                <strong>Email:</strong> tiwarienterprises@gmail.com
              </p>
            </div>
            <div>
              <h3 className="text-xl font-serif text-brown-dark mb-2">Business Hours</h3>
              <p className="text-grey-dark">
                <strong>Monday - Sunday:</strong> 9:00 AM - 6:00 PM
              </p>
            </div>
            <div className="h-64 rounded-lg overflow-hidden shadow-lg">
              <ParallaxImage src="https://iili.io/fjiFKQI.md.jpg" alt="Tiwari Enterprises Showroom" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white/50 p-8 rounded-lg shadow-lg backdrop-blur-sm">
            <h2 className="text-3xl font-serif text-brown-dark mb-6 uppercase">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-grey-dark">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-beige/50 border border-brown-light/50 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown-light focus:border-brown-dark transition-all duration-200" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-grey-dark">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-beige/50 border border-brown-light/50 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown-light focus:border-brown-dark transition-all duration-200" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-grey-dark">Mobile Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-beige/50 border border-brown-light/50 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown-light focus:border-brown-dark transition-all duration-200" />
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-grey-dark">Reason for Inquiry</label>
                <select id="reason" name="reason" value={formData.reason} onChange={handleChange} className="mt-1 block w-full bg-beige/50 border border-brown-light/50 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown-light focus:border-brown-dark transition-all duration-200">
                  <option>Interior Design</option>
                  <option>Renovation</option>
                  <option>Consultation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-grey-dark">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className="mt-1 block w-full bg-beige/50 border border-brown-light/50 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brown-light focus:border-brown-dark transition-all duration-200"></textarea>
              </div>
              <div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brown-dark text-white py-3 px-4 rounded-md hover:bg-brown transition-colors duration-300 font-semibold disabled:bg-brown-light disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast message={toastMessage} onClear={() => setToastMessage('')} />
    </>
  );
};

export default Contact;