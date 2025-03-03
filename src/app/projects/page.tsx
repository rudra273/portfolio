// src/app/projects/page.tsx
"use client";
import ProjectCardHorizontal from '@/components/ProjectCardHorizontal'
import { projects, allTechStacks, projectCategories } from '@/projects'
import { useState } from 'react';

export default function ProjectsPage() {
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
    <div className="w-full py-20">
      <div className="max-w-[95%] mx-auto px-2 sm:px-4">
        <h1 className="text-2xl font-bold text-white mb-8 text-left font-roboto">All Projects</h1>

        {/* Category Filters */}
        <div className="mb-6">
          <h2 className="text-white text-sm mb-2">Categories</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {projectCategories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-md transition-colors duration-200 text-sm
                  ${selectedCategories.includes(category)
                    ? 'bg-blue-500 text-white font-medium'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'}
                  focus:outline-none focus:ring-1 focus:ring-blue-500`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tech Stack Filters */}
        <div className="mb-8">
          <h2 className="text-white text-sm mb-2">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {allTechStacks.map((tech) => (
              <button
                key={tech}
                className={`px-3 py-1 rounded-md transition-colors duration-200 text-sm
                  ${selectedTechStacks.includes(tech)
                    ? 'bg-white text-gray-900 font-medium'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'}
                  focus:outline-none focus:ring-1 focus:ring-white`}
                onClick={() => toggleTechStack(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {filteredProjects.slice().reverse().map((project) => (
            <div key={project.id} className="transition-transform duration-200 hover:scale-[1.02]">
              <ProjectCardHorizontal {...project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}