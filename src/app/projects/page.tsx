// src/app/projects/page.tsx
"use client";
import ProjectCardHorizontal from '@/components/ProjectCardHorizontal'
import { projects, allTechStacks } from '@/projects'
import { useState } from 'react';

export default function ProjectsPage() {
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);

  const filteredProjects = selectedTechStacks.length > 0
    ? projects.filter(project =>
        selectedTechStacks.every(tech => project.techStack.includes(tech))
      )
    : projects;

  const toggleTechStack = (tech: string) => {
    setSelectedTechStacks(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  return (
    <div className="w-full py-20">
      <div className="max-w-[95%] mx-auto px-2 sm:px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-left font-roboto">All Projects</h1>

        {/* Selected Filters Display */}
        {selectedTechStacks.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-white">Selected:</span>
          {selectedTechStacks.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 bg-white text-black rounded-full flex items-center gap-1 text-sm"
            >
              {tech}
              <button
                onClick={() => toggleTechStack(tech)}
                className="hover:text-gray-700 ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        )}

      {/* Tech Stack Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allTechStacks.map((tech) => (
          <button
            key={tech}
            className={`px-3 py-1 rounded-md text-white transition-colors duration-200 text-sm
              ${selectedTechStacks.includes(tech) 
                ? 'bg-white text-black' 
                : 'bg-gray-800 hover:bg-gray-700'} 
              focus:outline-none focus:ring-1 focus:ring-white`}
            onClick={() => toggleTechStack(tech)}
          >
            {tech}
          </button>
        ))}
      </div>

        <div className="flex flex-col gap-8">
          {filteredProjects.map((project) => (
            <ProjectCardHorizontal key={project.id} {...project} />
          ))}
        </div>
      </div>
    </div>
  )
}