// // src/app/contact/page.tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:rudramohanty45@gmail.com?subject=${subject}&body=${body}`;

    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="w-full">
      <section className="flex flex-col justify-center items-center text-center px-2 py-20">
        <h1 className="text-4xl md:text-6xl text-white font-light font-roboto">Contact Me</h1>
      </section>

      <section className="py-8 px-2 sm:px-4">
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300 mb-2 font-poppins">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-gray-900 bg-white/70 focus:outline-none font-poppins"
                placeholder="Your name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2 font-poppins">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-gray-900 bg-white/70 focus:outline-none font-poppins"
                placeholder="Your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-300 mb-2 font-poppins">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 text-gray-900 bg-white/70 focus:outline-none font-poppins"
                placeholder="Your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full text-white px-4 py-2 font-poppins border border-white hover:bg-white hover:text-gray-800 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}