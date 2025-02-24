// // src/app/page.tsx
// import Link from 'next/link'
// import ProjectCard from '@/components/ProjectCard'
// import { projects } from '@/projects'

// import Footer from '@/components/Footer'
// import Skills from '@/components/Skills'


// export default function Home() {
//   return (
//     <div className="w-full">
//       <section className="h-screen flex flex-col justify-center items-center text-center px-2">
//         <h1 className="text-4xl md:text-6xl text-white mb-4 font-light font-roboto">RUDRAPRATAP MOHANTY</h1>
//         <p className="text-xl md:text-2xl text-gray-300 font-poppins">Software Developer</p>
//       </section>


//       <section className="py-16 px-2 sm:px-4">
//         <Skills />
//       </section>

//       <section className="py-16 px-2 sm:px-4">
//         <div className="max-w-[90%] mx-auto">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center font-roboto">Top Projects</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {projects.slice(0, 2).map((project) => (
//               <ProjectCard key={project.id} {...project} />
//             ))}
//           </div>
//           <div className="text-center mt-8">
//             <Link href="/projects" className="text-white hover:text-gray-300 underline font-poppins">
//               View All Projects
//             </Link>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 px-2 sm:px-4">
//         <Footer />
//       </section>

//     </div>
//   )
// }


// invisble effect on scroll down --------------------------------------------
// 'use client'

// import { useEffect } from 'react'
// import Link from 'next/link'
// import ProjectCard from '@/components/ProjectCard'
// import { projects } from '@/projects'
// import Footer from '@/components/Footer'
// import Skills from '@/components/Skills'

// export default function Home() {
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('visible');
//           } else {
//             entry.target.classList.remove('visible');
//           }
//         });
//       },
//       {
//         threshold: 0.15,
//         rootMargin: '0px'
//       }
//     );

//     document.querySelectorAll('.float-section').forEach(section => {
//       observer.observe(section);
//     });

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className="w-full">
//       <section className="h-screen flex flex-col justify-center items-center text-center px-2">
//         <h1 className="text-4xl md:text-6xl text-white mb-4 font-light font-roboto">RUDRAPRATAP MOHANTY</h1>
//         <p className="text-xl md:text-2xl text-gray-300 font-poppins">Software Developer</p>
//       </section>

//       <section className="py-16 px-2 sm:px-4 float-section">
//         <Skills />
//       </section>

//       <section className="py-16 px-2 sm:px-4 float-section">
//         <div className="max-w-[90%] mx-auto">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center font-roboto">Top Projects</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {projects.slice(0, 2).map((project) => (
//               <ProjectCard key={project.id} {...project} />
//             ))}
//           </div>
//           <div className="text-center mt-8">
//             <Link href="/projects" className="text-white hover:text-gray-300 underline font-poppins">
//               View All Projects
//             </Link>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 px-2 sm:px-4 float-section">
//         <Footer />
//       </section>
//     </div>
//   )
// }


// // floating in space --------------------------------------------
'use client'

import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/projects'
import Footer from '@/components/Footer'
import Skills from '@/components/Skills'

export default function Home() {
  return (
    <div className="w-full">
      <section className="h-screen flex flex-col justify-center items-center text-center px-2">
        <h1 className="text-4xl md:text-6xl text-white mb-4 font-light font-roboto">RUDRAPRATAP MOHANTY</h1>
        <p className="text-xl md:text-2xl text-gray-300 font-poppins">Software Developer</p>
      </section>

      <section className="py-16 px-2 sm:px-4 float-section transition-all duration-500 ease-in-out">
        <Skills />
      </section>

      <section className="py-16 px-2 sm:px-4 float-section transition-all duration-500 ease-in-out">
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

      <section className="py-16 px-2 sm:px-4 float-section transition-all duration-500 ease-in-out">
        <Footer />
      </section>
    </div>
  )
}
