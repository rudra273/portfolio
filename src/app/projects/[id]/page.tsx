// // src/app/projects/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt, FaCode, FaRocket } from 'react-icons/fa'
import { projects } from '@/projects'
 
export default function ProjectPage() {
  const params = useParams()
  const id = params.id as string
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-4">Project not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="fixed -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="fixed top-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h1>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Link 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm border border-gray-700 shadow-lg"
            >
              <FaGithub className="mr-2" /> Source
            </Link>
            <Link 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-500 text-sm shadow-lg"
            >
              <FaExternalLinkAlt className="mr-2" /> Live Demo
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-xl">
              <div className="grid gap-4">
                {project.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-lg border border-gray-700 shadow-lg"
                  >
                    <Image 
                      src={image} 
                      alt={`${project.title} screenshot ${index + 1}`} 
                      width={600} 
                      height={400} 
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-lg border-l-4 border-blue-500 shadow-xl">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{project.description}</p>
              </div>
            </div>
            
            <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-lg border-l-4 border-purple-500 shadow-xl mt-8">
              <div className="flex items-center mb-4">
                <FaCode className="text-purple-400 mr-3" />
                <h2 className="text-xl font-bold text-white">Tech Stack</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span 
                    key={tech} 
                    className={`
                      text-white px-3 py-1 rounded-lg text-sm shadow-sm 
                      ${index % 3 === 0 ? 'bg-blue-600/60' : index % 3 === 1 ? 'bg-purple-600/60' : 'bg-indigo-600/60'}
                    `}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-lg border-l-4 border-green-500 shadow-xl mt-8">
              <div className="flex items-center mb-4">
                <FaRocket className="text-green-400 mr-3" />
                <h2 className="text-xl font-bold text-white">Key Features</h2>
              </div>
              
              <ul className="space-y-2 text-gray-300">
                {project.features && project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mt-2 mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}