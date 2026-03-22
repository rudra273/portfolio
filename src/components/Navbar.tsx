// src/components/Navbar.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50" style={{
      background: 'rgba(5, 8, 22, 0.6)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(102, 252, 241, 0.08)',
    }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold font-space tracking-wider"
            style={{ color: '#66FCF1' }}
          >
            RM<span className="text-white/40 font-light"> /&gt;</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-3 py-1.5 text-sm sm:text-base font-space tracking-wide
                    transition-all duration-300 rounded-lg
                    ${isActive
                      ? 'text-accent-cyan'
                      : 'text-white/70 hover:text-white hover:bg-white/5'}
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4/5 rounded-full"
                      style={{ background: '#66FCF1' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
