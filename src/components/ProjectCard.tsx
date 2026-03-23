// src/components/ProjectCard.tsx
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
    <div className="glass-card overflow-hidden group flex flex-col items-stretch h-full">
      {/* Image container: Always top (vertical layout) */}
      <Link href={`/projects/${id}`} className="block w-full shrink-0 relative">
        <div className="relative overflow-hidden w-full aspect-[16/8]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(180deg, transparent 40%, rgba(5, 8, 22, 0.95) 100%)',
            }}
          />
        </div>
      </Link>

      {/* Content container: Always bottom */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <Link href={`/projects/${id}`} className="block">
          <h3 className="text-[13px] sm:text-sm md:text-base font-bold text-white mb-1 md:mb-1.5 font-space group-hover:text-accent-cyan transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
          {/* Visible everywhere, clamped */}
          <p className="text-white/55 text-[10px] md:text-[11px] mb-2 md:mb-3 font-poppins leading-snug line-clamp-2 md:line-clamp-3">
            {description}
          </p>
        </Link>

        {/* Tech Stack Pills - visible everywhere */}
        <div className="flex flex-wrap gap-1 mb-3 md:mb-4">
          {techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[8px] md:text-[9px] font-space px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{
                background: 'rgba(102, 252, 241, 0.08)',
                border: '1px solid rgba(102, 252, 241, 0.15)',
                color: 'rgba(102, 252, 241, 0.8)',
              }}
            >
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="text-[8px] md:text-[9px] font-space px-1.5 py-0.5 text-white/50">+{techStack.length - 3}</span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 md:gap-4 md:pt-2 md:border-t md:border-white/5 mt-auto">
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/50 hover:text-accent-cyan text-[9px] md:text-[11px] font-space transition-colors duration-300"
          >
            <FaGithub className="text-[10px] md:text-xs" /> Source
          </Link>
          <Link
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/50 hover:text-accent-cyan text-[9px] md:text-[11px] font-space transition-colors duration-300"
          >
            <FaExternalLinkAlt className="text-[9px] md:text-xs" /> Live
          </Link>
        </div>
      </div>
    </div>
  );
}