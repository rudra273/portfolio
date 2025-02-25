// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="max-w-[95%] mx-auto px-2 sm:px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/particle" className="text-2xl font-bold text-white pl-1 sm:pl-2">RM</Link>
          <div className="space-x-3 sm:space-x-4 pr-1 sm:pr-2 text-sm sm:text-base">
            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
            <Link href="/about" className="text-white hover:text-gray-300">About</Link>
            <Link href="/projects" className="text-white hover:text-gray-300">Projects</Link>
            <Link href="/blog" className="text-white hover:text-gray-300">Blog</Link>
            <Link href="/contact" className="text-white hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}