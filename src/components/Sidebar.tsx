// // src/components/Sidebar.tsx

import Link from 'next/link';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from "react-icons/si";
import { MdEmail } from "react-icons/md"; 
import { FaXTwitter } from 'react-icons/fa6';


export default function Sidebar() {
  // Common shadow style for all icons
  const iconStyle = "text-white text-2xl hover:text-gray-300 drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]";
  
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-row space-x-8 pb-8">
        <Link href="https://www.linkedin.com/in/rudrapratap-mohanty-2b57041b5" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className={iconStyle} />
        </Link>
        <Link href="https://github.com/rudra273" target="_blank" rel="noopener noreferrer">
          <FaGithub className={iconStyle} />
        </Link>
        <Link href="https://leetcode.com/rudra273/" target="_blank" rel="noopener noreferrer">
          <SiLeetcode className={iconStyle} />
        </Link>
        <Link href="mailto:rudramohanty45@gmail.com" target="_blank" rel="noopener noreferrer">
          <MdEmail className={iconStyle} />
        </Link>
        <Link href="https://twitter.com/your-x-handle" target="_blank" rel="noopener noreferrer">
          <FaXTwitter className={iconStyle} />
        </Link>
        <Link href="https://www.instagram.com/rudra.273" target="_blank" rel="noopener noreferrer">
          <FaInstagram className={iconStyle} />
        </Link>
      </div>
    </div>
  );
}