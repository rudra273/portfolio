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
    <div className="glass-card overflow-hidden group">
      <Link href={`/projects/${id}`} className="block">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 40%, rgba(5, 8, 22, 0.9) 100%)',
            }}
          />
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/projects/${id}`} className="block">
          <h3 className="text-lg font-semibold text-white mb-2 font-space group-hover:text-accent-cyan transition-colors duration-300">
            {title}
          </h3>
          <p className="text-white/55 text-sm mb-4 font-poppins leading-relaxed line-clamp-2">
            {description}
          </p>
        </Link>

        <div className="flex flex-wrap gap-2 mb-5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-space px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(102, 252, 241, 0.08)',
                border: '1px solid rgba(102, 252, 241, 0.15)',
                color: 'rgba(102, 252, 241, 0.8)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/50 hover:text-accent-cyan text-sm font-space transition-colors duration-300"
          >
            <FaGithub /> Source
          </Link>
          <Link
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/50 hover:text-accent-cyan text-sm font-space transition-colors duration-300"
          >
            <FaExternalLinkAlt className="text-xs" /> Live
          </Link>
        </div>
      </div>
    </div>
  );
}