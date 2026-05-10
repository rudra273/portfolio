import Link from 'next/link';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  const socialLinks = [
    { href: 'https://www.linkedin.com/in/rudrapratap-mohanty-2b57041b5', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://github.com/rudra273', icon: FaGithub, label: 'GitHub' },
    { href: 'https://leetcode.com/rudra273/', icon: SiLeetcode, label: 'LeetCode' },
    { href: 'mailto:rudramohanty45@gmail.com', icon: MdEmail, label: 'Email' },
    { href: 'https://twitter.com/your-x-handle', icon: FaXTwitter, label: 'X' },
    { href: 'https://www.instagram.com/rudra.273', icon: FaInstagram, label: 'Instagram' },
  ];

  return (
    <>
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center relative px-4 py-12 md:py-24 overflow-hidden rounded-3xl border border-white/5 bg-black/20 backdrop-blur-xl mb-8">
        {/* Deep space glow effect behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-accent-cyan/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

        {/* Main CTA Content */}
        <div className="text-center z-10 relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full mb-8 border border-accent-cyan/20 bg-accent-cyan/5">
            <span className="text-accent-cyan/70 font-space text-xs tracking-[0.2em] uppercase">
              Communication Channel Open
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-space tracking-tight mb-6 leading-tight">
            Ready to Cross the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple pulse-glow block mt-2">
              Event Horizon?
            </span>
          </h2>
          
          <p className="text-white/40 text-sm md:text-lg font-poppins max-w-2xl mx-auto mb-14 leading-relaxed">
            Whether you are looking to build intelligent systems, scale cloud infrastructure, or just want to explore the universe of code together, my inbox is always open.
          </p>

          <Link href="/contact" className="inline-block group relative">
            <div className="absolute inset-0 bg-accent-cyan/20 blur-xl group-hover:bg-accent-cyan/40 transition-colors duration-500 rounded-full" />
            <button className="relative px-8 sm:px-12 py-4 sm:py-5 bg-black/50 backdrop-blur-md border border-accent-cyan/50 text-white font-space tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-sm rounded-full hover:border-accent-cyan hover:shadow-[0_0_40px_rgba(102,252,241,0.4)] transition-all duration-300">
              Enter the Singularity
            </button>
          </Link>
        </div>
      </div>

      {/* Minimalist Bottom Bar */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 pb-8 z-10">
        <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-accent-cyan text-lg md:text-xl transition-all duration-300 hover:scale-110"
              aria-label={link.label}
            >
              <link.icon />
            </Link>
          ))}
        </div>
        <p className="text-white/20 font-space text-[10px] tracking-[0.2em] uppercase text-center md:text-right">
          © {new Date().getFullYear()} Rudrapratap Mohanty<br className="md:hidden mt-1" />
          <span className="hidden md:inline"> • </span>Built with Next.js & Three.js
        </p>
      </div>
    </>
  );
};

export default Footer;