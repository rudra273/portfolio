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
    <footer className="glass-card-static mt-16 mx-4 sm:mx-8 mb-8">
      <div
        className="h-[1px] w-full rounded-t-2xl"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(102, 252, 241, 0.4), rgba(157, 78, 221, 0.4), transparent)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-2 font-space">Rudrapratap Mohanty</h3>
            <p className="text-white/50 font-poppins text-sm leading-relaxed max-w-sm">
              Software Developer passionate about building impactful solutions with AI, Backend, and Cloud technologies.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-accent-cyan/70 font-space text-sm tracking-wide">Let&apos;s Connect</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-accent-cyan text-xl transition-all duration-300 hover:scale-110"
                  aria-label={link.label}
                >
                  <link.icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="text-center mt-8 pt-6"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
        >
          <p className="text-white/25 font-poppins text-xs">
            © {new Date().getFullYear()} Rudrapratap Mohanty • Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;