// src/components/Sidebar.tsx
import Link from 'next/link';
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="fixed left-4 bottom-0 z-50">
      <div className="flex flex-col space-y-4 pb-8">
        <Link href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-white text-2xl hover:text-gray-300" />
        </Link>
      </div>
    </div>
  );
}

