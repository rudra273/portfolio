// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { MdEmail, MdPhone } from 'react-icons/md';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:rudramohanty45@gmail.com?subject=${subject}&body=${body}`;

    setName('');
    setEmail('');
    setMessage('');
  };

  const socialLinks = [
    { href: 'https://linkedin.com/in/rudrapratap-mohanty-2b57041b5', displayUrl: 'linkedin.com/in/rudra...', icon: FaLinkedin, color: 'text-blue-400' },
    { href: 'https://github.com/rudra273', displayUrl: 'github.com/rudra273', icon: FaGithub, color: 'text-white' },
    { href: 'https://leetcode.com/rudra273/', displayUrl: 'leetcode.com/rudra273', icon: SiLeetcode, color: 'text-yellow-500' },
    { href: 'https://twitter.com/your-x-handle', displayUrl: 'x.com/your-x-handle', icon: FaXTwitter, color: 'text-white' },
    { href: 'https://instagram.com/rudra.273', displayUrl: 'instagram.com/rudra.273', icon: FaInstagram, color: 'text-pink-500' },
  ];

  return (
    <div className="w-full pt-32 pb-24 px-4 sm:px-6 relative min-h-screen overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Contact Info & Transmissions */}
        <div className="flex flex-col">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full mb-6 border border-accent-cyan/20 bg-accent-cyan/5 w-max">
            <div className="w-2 h-2 rounded-full bg-accent-cyan mr-3 animate-pulse" />
            <span className="text-accent-cyan/70 font-space text-[10px] tracking-[0.2em] uppercase">
              Secure Channel Open
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space text-white tracking-tight mb-6">
            Establish <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
              Connection
            </span>
          </h1>

          <p className="text-white/50 font-poppins text-sm leading-relaxed mb-10 max-w-md">
            Whether you are looking to collaborate on a new intelligent system or optimize an existing infrastructure, 
            transmit a message directly to my inbox below.
          </p>

          <div className="space-y-4 mb-10">
            {/* Direct Information */}
            <div className="glass-card p-4 md:p-5 flex items-center gap-5 border border-white/5 hover:border-accent-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20 group-hover:scale-110 transition-transform">
                <MdEmail className="text-2xl text-accent-cyan" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-space tracking-widest text-white/40 uppercase mb-1">Assigned Email</p>
                <p className="text-sm sm:text-base font-poppins text-white select-all">rudramohanty45@gmail.com</p>
              </div>
            </div>

            <div className="glass-card p-4 md:p-5 flex items-center gap-5 border border-white/5 hover:border-accent-purple/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center border border-accent-purple/20 group-hover:scale-110 transition-transform">
                <MdPhone className="text-2xl text-accent-purple" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-space tracking-widest text-white/40 uppercase mb-1">Encrypted Signal</p>
                {/* User can update this number easily later */}
                <p className="text-sm sm:text-base font-poppins text-white select-all">+91 XXXXX XXXXX</p>
              </div>
            </div>
          </div>

          {/* Social Links Matrix */}
          <div>
            <h3 className="text-white/30 font-space text-[10px] tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
              External Network Nodes
            </h3>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.displayUrl}
                  href={link.href}
                  target="_blank"
                  className="flex items-center gap-4 group p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                >
                  <div className={`text-xl ${link.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform`} >
                    <link.icon />
                  </div>
                  <span className="font-poppins text-sm text-white/50 group-hover:text-white transition-colors">
                    {link.displayUrl}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Transmission Form */}
        <div className="hud-panel p-8 md:p-10 relative">
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent-cyan/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-accent-cyan/20 rounded-bl-2xl" />
          
          <h2 className="text-xl md:text-2xl font-space font-bold text-white mb-8 border-b border-white/10 pb-4">
            Transmission Protocol
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="name" className="block text-[10px] font-space tracking-widest text-accent-cyan/70 uppercase mb-2">
                Identifier (Name)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-poppins text-sm focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                placeholder="Enter your name..."
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-space tracking-widest text-accent-cyan/70 uppercase mb-2">
                Return Address (Email)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-poppins text-sm focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                placeholder="Enter your email..."
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[10px] font-space tracking-widest text-accent-cyan/70 uppercase mb-2">
                Payload (Message)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-poppins text-sm focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all resize-none"
                placeholder="Initialize transmission content..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-4 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan font-space tracking-widest text-xs uppercase hover:bg-accent-cyan/20 hover:shadow-[0_0_20px_rgba(102,252,241,0.2)] transition-all flex justify-center items-center group"
            >
              <span className="group-hover:-translate-y-0.5 transition-transform">Transmit Signal</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}