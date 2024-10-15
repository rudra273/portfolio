// src/app/projects/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { projects } from '@/projects'

export default function ProjectPage() {
  const params = useParams()
  const id = params.id as string
  const project = projects.find(p => p.id === id)

  if (!project) {
    return <div className="text-white text-center py-20">Project not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white mb-8">{project.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-8">
            {project.images.map((image, index) => (
              <Image key={index} src={image} alt={`${project.title} screenshot ${index + 1}`} width={600} height={400} className="mb-4 rounded-lg" />
            ))}
          </div>
          <div className="flex space-x-4 mb-8">
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
              <FaGithub className="mr-2" /> View Source
            </Link>
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
              <FaExternalLinkAlt className="mr-2" /> View Live
            </Link>
          </div>
        </div>
        <div>
          <p className="text-gray-300 mb-8">{project.fullDescription}</p>
          <h2 className="text-2xl font-bold text-white mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech) => (
              <span key={tech} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}