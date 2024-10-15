// // src/app/page.tsx
// import Link from 'next/link'
// import SkillIcon from '@/components/SkillIcon'
// import ProjectCard from '@/components/ProjectCard'
// import { projects } from '@/projects'
// import { FaPython, FaJs, FaDatabase } from 'react-icons/fa'
// import FloatingElement from '@/components/FloatingElement';

// const skills = [
//   { name: 'Python', icon: FaPython },
//   { name: 'JavaScript', icon: FaJs },
//   { name: 'PostgreSQL', icon: FaDatabase },
// ]

// export default function Home() {
//   return (
//     <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center">
//       <section className="text-center py-20 flex-grow flex flex-col justify-center">
//         <h1 className="text-6xl text-white mb-4">RUDRAPRATAP MOHANTY</h1>
//         <p className="text-2xl text-gray-300">Software Developer</p>
//       </section>


//       <section className="py-20">
//         <h2 className="text-4xl font-bold text-white mb-8 text-center">Skills</h2>
//         <div className="flex justify-center space-x-8">
//           {skills.map((skill) => (
//             <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
//           ))}
//         </div>
//       </section>

//       <section className="py-20">
//         <h2 className="text-4xl font-bold text-white mb-8 text-center">Top Projects</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {projects.slice(0, 2).map((project) => (
//             <ProjectCard key={project.id} {...project} />
//           ))}
//         </div>
//         <div className="text-center mt-8">
//           <Link href="/projects" className="text-white hover:text-gray-300 underline">
//             View All Projects
//           </Link>
//         </div>
//       </section>
//     </div>
//   )
// }

// src/app/page.tsx
import Link from 'next/link'
import SkillIcon from '@/components/SkillIcon'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/projects'
import { FaPython, FaJs, FaDatabase, FaDocker, FaGit, FaLinux, FaAws } from 'react-icons/fa'
import { SiKubernetes, SiAzuredevops, SiDjango, SiFastapi, SiTailwindcss } from 'react-icons/si'

const skills = [
  { name: 'Python', icon: FaPython },
  { name: 'JavaScript', icon: FaJs },
  { name: 'PostgreSQL', icon: FaDatabase },
  { name: 'Docker', icon: FaDocker },
  { name: 'Kubernetes', icon: SiKubernetes },
  { name: 'Git', icon: FaGit },
  { name: 'Linux', icon: FaLinux },
  { name: 'AWS', icon: FaAws },
  { name: 'Azure', icon: SiAzuredevops },
  { name: 'Django', icon: SiDjango },
  { name: 'FastAPI', icon: SiFastapi },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
]

export default function Home() {
  return (
    <div className="w-full">
      <section className="h-screen flex flex-col justify-center items-center text-center px-2">
        <h1 className="text-4xl md:text-6xl text-white mb-4 font-light font-roboto">RUDRAPRATAP MOHANTY</h1>
        <p className="text-xl md:text-2xl text-gray-300 font-poppins">Software Developer</p>
      </section>

      <section className="py-16 px-2 sm:px-4">
        <div className="max-w-[95%] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center font-roboto">Skills</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {skills.map((skill) => (
              <SkillIcon key={skill.name} name={skill.name} Icon={skill.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-2 sm:px-4">
        <div className="max-w-[90%] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center font-roboto">Top Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/projects" className="text-white hover:text-gray-300 underline font-poppins">
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}