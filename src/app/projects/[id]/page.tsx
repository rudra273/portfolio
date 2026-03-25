// src/app/projects/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt, FaCode, FaRocket } from 'react-icons/fa'
import { useEffect, useState } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  techStack: string[];
  categories: string[];
  githubUrl: string;
  liveUrl: string;
}
 
export default function ProjectPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          const found = data.projects.find((p: Project) => String(p.id) === String(id));
          setProject(found || null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch project:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16 px-4">
        <div className="hud-panel p-10 text-center max-w-md w-full">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-accent-cyan/70 font-space text-[10px] tracking-widest uppercase">
              Loading Data
            </span>
          </div>
          <p className="text-white/50 font-poppins text-sm">Accessing archive records...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16 px-4">
        <div className="hud-panel p-10 text-center max-w-md w-full">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400/70 font-space text-[10px] tracking-widest uppercase">
              Error 404
            </span>
          </div>
          <h1 className="text-2xl font-bold font-space text-white mb-2">Project Not Found</h1>
          <p className="text-white/50 font-poppins text-sm mb-6">The requested file could not be located in the archive.</p>
          <Link href="/projects" className="text-accent-cyan font-space text-xs tracking-widest uppercase hover:text-accent-cyan/70 transition-colors">
            &larr; Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative z-10 w-full overflow-x-hidden">
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <Link href="/projects" className="inline-flex items-center text-white/30 hover:text-accent-cyan font-space text-[10px] tracking-widest uppercase mb-8 transition-colors">
              &larr; Back to Archive
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-accent-cyan/70 font-space text-[10px] tracking-[0.3em] uppercase">
                Project File // {project.id.padStart(3, '0')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-space text-white tracking-wide leading-tight">
              {project.title}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-accent-cyan/50 hover:bg-white/10 text-white/80 hover:text-white font-space text-xs tracking-widest uppercase transition-all duration-300 group"
            >
              <FaGithub className="mr-3 text-sm group-hover:text-accent-cyan transition-colors" /> Source Code
            </Link>
            <Link 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-5 py-2.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 hover:border-accent-cyan hover:bg-accent-cyan/20 text-accent-cyan font-space text-xs tracking-widest shadow-[0_0_15px_rgba(102,252,241,0.1)] hover:shadow-[0_0_20px_rgba(102,252,241,0.3)] uppercase transition-all duration-300 group"
            >
              <FaExternalLinkAlt className="mr-3 text-sm group-hover:scale-110 transition-transform" /> Live Demo
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Visuals Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="hud-panel p-2 sm:p-4">
              <div className="flex items-center gap-2 mb-4 px-2 pt-2 border-b border-white/5 pb-3">
                <div className="w-2 h-2 rounded-full bg-accent-purple/50" />
                <span className="text-white/30 font-space text-[10px] tracking-widest uppercase">Visual Logs</span>
              </div>
              <div className="grid gap-6">
                {project.images.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-xl border border-white/5 group"
                  >
                    <Image 
                      src={image} 
                      alt={`${project.title} screenshot ${index + 1}`} 
                      width={800} 
                      height={500} 
                      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    {/* Scanline overlay effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-overlay opacity-50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Project Details Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Description */}
            <div className="hud-panel p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-accent-cyan/20 rounded-tl-xl" />
              <h2 className="text-white/40 font-space text-[10px] tracking-widest uppercase mb-4 border-b border-white/10 pb-3">
                Mission Brief
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/70 font-poppins text-sm leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>
            
            {/* Tech Stack */}
            <div className="hud-panel p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-accent-purple/20 rounded-tr-xl" />
              <div className="flex items-center mb-6 border-b border-white/10 pb-3">
                <FaCode className="text-accent-purple text-lg mr-3" />
                <h2 className="text-white/40 font-space text-[10px] tracking-widest uppercase">
                  Tech Stack Matrix
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {project.techStack.map((tech: string) => (
                  <span 
                    key={tech} 
                    className="bg-accent-purple/10 border border-accent-purple/20 text-accent-purple font-space px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase shadow-[0_0_10px_rgba(157,78,221,0.05)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="hud-panel p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-accent-cyan/20 rounded-bl-xl" />
                <div className="flex items-center mb-6 border-b border-white/10 pb-3">
                  <FaRocket className="text-accent-cyan text-lg mr-3" />
                  <h2 className="text-white/40 font-space text-[10px] tracking-widest uppercase">
                    Key Features
                  </h2>
                </div>
                
                <ul className="space-y-3">
                  {project.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start text-white/70 font-poppins text-sm leading-relaxed">
                      <span className="inline-block w-1 h-1 rounded-full bg-accent-cyan mt-2 mr-3 shrink-0 shadow-[0_0_8px_rgba(102,252,241,0.8)]"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}