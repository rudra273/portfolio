// src/components/Sidebar.tsx
import Link from 'next/link';
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="fixed left-4 bottom-0 z-50">
      <div className="flex flex-col space-y-4 pb-8">
        <Link href="https://www.linkedin.com/in/rudrapratap-mohanty-2b57041b5" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://github.com/rudra273" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://www.facebook.com/rudra.mohanty.357" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://www.instagram.com/rudra.273" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-white text-2xl hover:text-gray-300" />
        </Link>
        
      </div>
    </div>
  );
}

