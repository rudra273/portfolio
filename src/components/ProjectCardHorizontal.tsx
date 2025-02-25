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

export default function ProjectCardHorizontal({
  id,
  title,
  description,
  image,
  techStack,
  githubUrl,
  liveUrl,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col md:flex-row bg-space-blue bg-opacity-50 rounded-md overflow-hidden shadow-lg border border-gray-700">
      <div className="relative md:w-2/5 w-full aspect-video">
      <Link href={`/projects/${id}`}>
        <Image 
          src={image} 
          alt={title} 
          fill
          className="object-cover rounded-tl-md rounded-tr-md md:rounded-tr-none md:rounded-bl-md"
        />
      </Link>
      </div>
      <div className="p-6 md:w-3/5 flex flex-col justify-between">
        <div>
          <Link href={`/projects/${id}`}>
            <h3 className="text-2xl font-bold text-white mb-2 hover:text-gray-300 font-roboto">
              {title}
            </h3>
            <p className="text-gray-300 mb-4 font-poppins">{description}</p>
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-poppins"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <FaGithub className="mr-2" /> View Source
          </Link>
          <Link
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <FaExternalLinkAlt className="mr-2" /> View Website
          </Link>
        </div>
      </div>
    </div>
  );
}