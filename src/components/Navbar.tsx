// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">RM</Link>
          <div className="space-x-4">
            <Link href="/projects" className="text-white hover:text-gray-300">Projects</Link>
            <Link href="/blog" className="text-white hover:text-gray-300">Blog</Link>
            <Link href="/contact" className="text-white hover:text-gray-300">Contact Me</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}