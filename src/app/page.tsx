// // src/app/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/projects'
import Footer from '@/components/Footer'
import Skills from '@/components/Skills'
import Button from '@/components/Button'; 

const FEATURED_PROJECT_IDS = ['4', '5'];

export default function Home() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const titles = useMemo(() => [
    "Software Developer",
    "Backend Developer", 
    "MLOps Engineer",
    "DevOps Engineer",
  ], []); 

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const currentTitle = titles[titleIndex];
    
    if (!isDeleting && displayText === currentTitle) {
      // Wait before starting to delete
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }
    
    if (isDeleting && displayText === '') {
      // Move to next title
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting 
          ? currentTitle.substring(0, displayText.length - 1)
          : currentTitle.substring(0, displayText.length + 1)
      );
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex, titles]);

  return (
    <div className="w-full">

      <section className="h-screen flex flex-col justify-center items-center text-center px-2" aria-label="Introduction">
        <h1 className="text-4xl md:text-6xl text-white mb-4 font-light font-roboto">
          RUDRAPRATAP MOHANTY
        </h1>
        
        <div className="h-8">
          <p className="text-xl md:text-2xl text-gray-300 font-poppins inline-block relative" aria-live="polite">
            {displayText}
            <span className="absolute right-0 top-0 h-full w-[2px] bg-gray-300 animate-blink" aria-hidden="true"></span>
          </p>
        </div>
      </section>

      <section className="py-16 px-2 sm:px-4 float-section transition-all duration-500 ease-in-out">
        <Skills />
      </section>

    <section className="py-16 px-2 sm:px-4 float-section transition-all duration-500 ease-in-out">
      <div className="max-w-[90%] mx-auto">
        <h2 className="text-3xl md:text-2xl font-bold mb-8 text-center font-roboto">Top Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects
            .filter(project => FEATURED_PROJECT_IDS.includes(project.id))
            .map((project) => (
              <ProjectCard key={project.id} {...project} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/projects">
            <Button>View All Projects</Button>
          </Link>
        </div>
      </div>
    </section>

      <section className="py-16 px-2 sm:px-4 float-section transition-all duration-500 ease-in-out ">
        <Footer />
      </section>
    </div>
  )
}