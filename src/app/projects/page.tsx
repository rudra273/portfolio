// // src/app/projects/page.tsx
// import ProjectCard from '@/components/ProjectCard'
// import { projects } from '@/projects'

// export default function ProjectsPage() {
//   return (
//     <div className="container mx-auto px-4 py-20">
//       <h1 className="text-4xl font-bold text-white mb-8 text-center font-roboto">All Projects</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {projects.map((project) => (
//           <ProjectCard key={project.id} {...project} />
//         ))}
//       </div>
//     </div>
//   )
// }

// src/app/projects/page.tsx
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/projects'

export default function ProjectsPage() {
  return (
    <div className="w-full py-20">
      <div className="max-w-[95%] mx-auto px-2 sm:px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center font-roboto">All Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </div>
  )
}