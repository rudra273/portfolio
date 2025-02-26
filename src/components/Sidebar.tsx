// src/components/Sidebar.tsx
import Link from 'next/link';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from "react-icons/si";
import { MdEmail } from "react-icons/md"; 
import { FaXTwitter } from 'react-icons/fa6'; // Assuming you'll use Font Awesome 6 for X


export default function Sidebar() {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-row space-x-8 pb-8">
        <Link href="https://www.linkedin.com/in/rudrapratap-mohanty-2b57041b5" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://github.com/rudra273" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://leetcode.com/rudra273/" target="_blank" rel="noopener noreferrer">
          <SiLeetcode className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="mailto:rudramohanty45@gmail.com" target="_blank" rel="noopener noreferrer">
          <MdEmail className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://twitter.com/your-x-handle" target="_blank" rel="noopener noreferrer">
          <FaXTwitter className="text-white text-2xl hover:text-gray-300" />
        </Link>
        <Link href="https://www.instagram.com/rudra.273" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-white text-2xl hover:text-gray-300" />
        </Link>
      </div>
    </div>
  );
}


