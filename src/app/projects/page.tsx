// src/app/projects/page.tsx
"use client";
import ProjectCardHorizontal from '@/components/ProjectCardHorizontal'
import { useState, useEffect } from 'react';

// Hardcoded fallback categories or derived
const projectCategories = [
  'LLM', 'MLOps', 'Backend', 'Full Stack', 'DevOps', 'Data Analysis', 'Cloud',
];

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTechStacks, setAllTechStacks] = useState<string[]>([]);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          setProjects(data.projects);
          const stacks = Array.from(new Set(data.projects.map((p: Project) => p.techStack).flat())) as string[];
          setAllTechStacks(stacks);
        }
      })
      .catch(err => {
        console.error('Failed to fetch projects:', err);
      });
  }, []);

  const filteredProjects = projects.filter(project => {
    const techStackMatch = selectedTechStacks.length === 0 || 
      selectedTechStacks.every(tech => project.techStack.includes(tech));
    
    const categoryMatch = selectedCategories.length === 0 ||
      selectedCategories.some(category => project.categories.includes(category));
    
    return techStackMatch && categoryMatch;
  });

  const toggleTechStack = (tech: string) => {
    setSelectedTechStacks(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="w-full pt-32 pb-24 px-4 sm:px-6 relative min-h-screen">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header HUD panel */}
        <div className="hud-panel p-8 md:p-10 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-accent-cyan/20 rounded-tl-2xl" />
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60 animate-pulse" />
            <span className="text-accent-cyan/40 font-space text-[10px] tracking-[0.2em] uppercase">
              Sys:Database
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 font-space tracking-wide">
            Project <span className="text-accent-cyan">Archive</span>
          </h1>
          <p className="text-white/50 font-poppins text-sm md:text-base max-w-2xl leading-relaxed mb-8">
            A comprehensive log of active and completed development cycles, containing source code references and live environment portals. 
            Filter by classification or framework below.
          </p>

          <div className="w-full h-px bg-gradient-to-r from-accent-cyan/20 via-transparent to-transparent mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Category Filters */}
            <div>
              <h2 className="text-accent-purple/70 font-space text-xs tracking-widest uppercase mb-4">
                Primary Classification
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {projectCategories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-1.5 rounded-full font-space text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300
                      ${selectedCategories.includes(category)
                        ? 'bg-accent-purple/20 border border-accent-purple text-accent-purple shadow-[0_0_15px_rgba(157,78,221,0.3)]'
                        : 'bg-white/5 border border-white/10 hover:border-accent-purple/50 text-white/50 hover:text-white'}
                      `}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack Filters */}
            <div>
              <h2 className="text-accent-cyan/70 font-space text-xs tracking-widest uppercase mb-4">
                Framework Matrix
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {allTechStacks.map((tech) => (
                  <button
                    key={tech}
                    className={`px-3 py-1.5 rounded-full font-space text-[10px] tracking-wider uppercase transition-all duration-300
                      ${selectedTechStacks.includes(tech)
                        ? 'bg-accent-cyan/20 border border-accent-cyan text-accent-cyan shadow-[0_0_15px_rgba(102,252,241,0.3)]'
                        : 'bg-white/5 border border-white/10 hover:border-accent-cyan/50 text-white/50 hover:text-white'}
                      `}
                    onClick={() => toggleTechStack(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex flex-col gap-10">
          {filteredProjects.length === 0 ? (
            <div className="hud-panel p-12 text-center">
              <p className="text-white/40 font-poppins mb-2">No data logs match the specified parameters.</p>
              <button 
                onClick={() => { setSelectedCategories([]); setSelectedTechStacks([]); }}
                className="text-accent-cyan font-space text-sm tracking-widest uppercase hover:text-accent-cyan/70"
              >
                Clear Override Filters
              </button>
            </div>
          ) : (
            filteredProjects.slice().reverse().map((project) => (
              <ProjectCardHorizontal key={project.id} {...project} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}