// // src/components/ProjectCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  image,
  techStack,
  githubUrl,
  liveUrl,
}: ProjectCardProps) {
  return (
    <div className="bg-space-blue bg-opacity-50 rounded-lg overflow-hidden shadow-lg">
      <Link href={`/projects/${id}`} className="block">
        <div className="aspect-video relative">
          <Image 
            src={image} 
            alt={title} 
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-2 hover:text-gray-300 font-roboto">{title}</h3>
          <p className="text-gray-300 mb-4 font-poppins">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.map((tech) => (
              <span key={tech} className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-poppins">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="px-6 pb-6">
        <div className="flex justify-between">
          <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-gray-300">
            <FaGithub className="mr-2" /> View Source
          </Link>
          <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-gray-300">
            <FaExternalLinkAlt className="mr-2" /> View Website
          </Link>
        </div>
      </div>
    </div>
  );
}