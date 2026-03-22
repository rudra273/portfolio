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
  const truncatedDescription = description.split(' ').slice(0, 25).join(' ');
  const showEllipsis = description.split(' ').length > 25;

  return (
    <div className="glass-card flex flex-col md:flex-row rounded-2xl overflow-hidden group border border-white/5 hover:border-accent-cyan/30 hover:shadow-[0_0_30px_rgba(102,252,241,0.1)] transition-all duration-300">
      
      {/* Image Section */}
      <div className="relative md:w-2/5 w-full aspect-video overflow-hidden shrink-0">
        <Link href={`/projects/${id}`} className="block w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradients to fade smoothly into the background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/80 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 md:hidden" />
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between relative z-10">
        <div>
          <Link href={`/projects/${id}`}>
            <h3 className="text-xl md:text-2xl font-bold font-space text-white mb-2 group-hover:text-accent-cyan transition-colors duration-300">
              {title}
            </h3>
          </Link>
          <p className="text-white/60 mb-4 font-poppins text-sm leading-relaxed">
            {truncatedDescription}
            <Link href={`/projects/${id}`} className="text-accent-cyan hover:text-accent-purple ml-1 transition-colors">
              {showEllipsis ? '... Read more' : ' Read more'}
            </Link>
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-space px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white/40 hover:text-accent-cyan text-xs font-space tracking-widest uppercase transition-colors"
          >
            <FaGithub className="mr-2 text-sm" /> View Source
          </Link>
          <Link
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white/40 hover:text-accent-purple text-xs font-space tracking-widest uppercase transition-colors"
          >
            <FaExternalLinkAlt className="mr-2 text-sm" /> Live Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
