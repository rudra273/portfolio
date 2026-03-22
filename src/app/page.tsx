// src/app/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/projects'
import Footer from '@/components/Footer'
import Skills from '@/components/Skills'
import Button from '@/components/Button'

// Social Icons
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiLeetcode } from 'react-icons/si'
import { MdEmail } from 'react-icons/md'

const FEATURED_PROJECT_IDS = ['4', '5'];

/* ─── Scroll-pinned section ─── */
function ScrollSection({
  children,
  scrollStart,
  scrollEnd,
  className = '',
}: {
  children: React.ReactNode
  scrollStart: number
  scrollEnd: number
  className?: string
}) {
  const { scrollYProgress } = useScroll()

  // If scrollStart is 0, we only fade OUT at the end. We don't fade IN.
  const isFirstSection = scrollStart === 0

  // Map the overall scroll progress to this section's local range
  const sectionProgress = useTransform(
    scrollYProgress,
    isFirstSection
      ? [0, scrollEnd - 0.05, scrollEnd]
      : [scrollStart, scrollStart + 0.05, scrollEnd - 0.05, scrollEnd],
    isFirstSection
      ? [1, 1, 0]
      : [0, 1, 1, 0]
  )

  // For the first section, it should start at scale 1 / y 0 / opacity 1
  const opacity = useTransform(
    sectionProgress,
    isFirstSection ? [1, 0] : [0, 1],
    isFirstSection ? [1, 0] : [0, 1]
  )
  const scale = useTransform(
    sectionProgress,
    isFirstSection ? [1, 0] : [0, 1],
    isFirstSection ? [1, 0.92] : [0.92, 1]
  )
  const y = useTransform(
    sectionProgress,
    isFirstSection ? [1, 0] : [0, 1],
    isFirstSection ? [0, -60] : [60, 0]
  )

  return (
    <div
      className={`sticky top-0 min-h-screen flex items-center justify-center px-4 sm:px-6 pointer-events-none ${className}`}
    >
      <motion.div
        style={{ opacity, scale, y }}
        className="w-full max-w-6xl pointer-events-auto"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function Home() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const titles = useMemo(
    () => ['AI / ML Engineer', 'Full Stack Developer', 'Coder'],
    []
  )

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100
    const currentTitle = titles[titleIndex]

    if (!isDeleting && displayText === currentTitle) {
      setTimeout(() => setIsDeleting(true), 1500)
      return
    }
    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setTitleIndex((prev) => (prev + 1) % titles.length)
      return
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentTitle.substring(0, displayText.length - 1)
          : currentTitle.substring(0, displayText.length + 1)
      )
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, titleIndex, titles])

  return (
    <div style={{ height: '500vh' }} className="relative w-full overflow-x-clip">

      {/* ═══ HERO — 0% to 22% scroll ═══ */}
      <ScrollSection scrollStart={0} scrollEnd={0.22}>
        {/* EDIT THIS LINE IF YOU WANT TO ADJUST TOP SPACING (e.g. change mt-16 or pt-12) */}
        <div className="text-center relative z-10 mt-16 md:mt-16">
          {/* Decorative orbit ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-accent-cyan/5 animate-spin-slow" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full mb-8 hud-border"
          >
            <span className="text-accent-cyan/70 font-space text-xs tracking-[0.2em] uppercase">
              System Online
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="block text-5xl sm:text-6xl md:text-8xl font-bold font-space tracking-tight text-white">
              Rudrapratap
            </span>
            <span
              className="block text-3xl sm:text-4xl md:text-6xl font-light font-space mt-2 tracking-widest"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              Mohanty
            </span>
          </motion.h1>

          {/* Typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-10 flex items-center justify-center mt-6 mb-6"
          >
            <div className="inline-flex items-center px-6 py-2 rounded-md hud-border">
              <p className="text-base md:text-lg text-white/60 font-poppins relative">
                {displayText}
                <span className="absolute right-[-4px] top-0 h-full w-[2px] bg-accent-cyan animate-blink" />
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-white/35 font-poppins text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Building intelligent systems at the intersection of AI, cloud
            infrastructure, and modern software engineering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4"
          >
            <Link href="/projects">
              <Button variant="primary">Explore Projects</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Enter the Singularity</Button>
            </Link>
          </motion.div>

          {/* Hero Social Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-12 mb-4"
          >
            <Link href="https://www.linkedin.com/in/rudrapratap-mohanty-2b57041b5" target="_blank" className="text-white/40 hover:text-accent-cyan text-xl hover:scale-110 transition-all"><FaLinkedin /></Link>
            <Link href="https://github.com/rudra273" target="_blank" className="text-white/40 hover:text-accent-cyan text-xl hover:scale-110 transition-all"><FaGithub /></Link>
            <Link href="https://leetcode.com/rudra273/" target="_blank" className="text-white/40 hover:text-accent-cyan text-xl hover:scale-110 transition-all"><SiLeetcode /></Link>
            <Link href="mailto:rudramohanty45@gmail.com" target="_blank" className="text-white/40 hover:text-accent-cyan text-xl hover:scale-110 transition-all"><MdEmail /></Link>
            <Link href="https://twitter.com/your-x-handle" target="_blank" className="text-white/40 hover:text-accent-cyan text-xl hover:scale-110 transition-all"><FaXTwitter /></Link>
            <Link href="https://www.instagram.com/rudra.273" target="_blank" className="text-white/40 hover:text-accent-cyan text-xl hover:scale-110 transition-all"><FaInstagram /></Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-white/20 text-xs font-space tracking-widest">
                SCROLL TO EXPLORE
              </span>
              <div className="w-[1px] h-8 bg-gradient-to-b from-accent-cyan/40 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </ScrollSection>

      {/* ═══ SKILLS — 20% to 42% scroll ═══ */}
      <ScrollSection scrollStart={0.18} scrollEnd={0.42}>
        <div className="hud-panel p-8 md:p-12 relative overflow-hidden">
          {/* HUD decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-accent-cyan/20 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-accent-cyan/20 rounded-br-2xl" />
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/40 pulse-glow" />
            <span className="text-accent-cyan/30 font-space text-[10px] tracking-widest uppercase">
              Nav:Skills
            </span>
          </div>
          <Skills />
        </div>
      </ScrollSection>

      {/* ═══ FEATURED PROJECTS — 40% to 72% scroll ═══ */}
      <ScrollSection scrollStart={0.38} scrollEnd={0.72}>
        <div className="hud-panel p-4 sm:p-6 md:p-8 relative overflow-hidden">
          {/* HUD decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-accent-purple/20 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-accent-purple/20 rounded-br-2xl" />
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple/40 pulse-glow" />
            <span className="text-accent-purple/30 font-space text-[10px] tracking-widest uppercase">
              Nav:Projects
            </span>
          </div>

          <div className="text-center mb-4">
            <p className="text-accent-cyan/50 font-space text-[10px] tracking-[0.3em] uppercase mb-1 md:mb-2">
              Portfolio
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-space tracking-wide">
              Featured Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {projects
              .filter((project) => FEATURED_PROJECT_IDS.includes(project.id))
              .map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
          </div>

          <div className="text-center mt-4">
            <Link href="/projects">
              <Button variant="primary">View All Projects</Button>
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* ═══ FOOTER — 68% to 92% scroll ═══ */}
      <ScrollSection scrollStart={0.68} scrollEnd={0.92}>
        <div className="relative">
          <Footer />
        </div>
      </ScrollSection>

      {/* ═══ Final fade-to-void — 90% to 100% ═══ */}
      <div className="sticky top-0 min-h-screen flex items-center justify-center pointer-events-none">
        <FadeToVoid />
      </div>
    </div>
  )
}

/* ─── Fade to black at the very end ─── */
function FadeToVoid() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0.88, 1], [0, 1])

  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 bg-[#020408] z-20 pointer-events-none flex items-center justify-center"
    >
      <p className="text-white/10 font-space text-sm tracking-[0.3em] uppercase">
        End of transmission
      </p>
    </motion.div>
  )
}