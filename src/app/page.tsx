// src/app/page.tsx
'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/projects'
import Footer from '@/components/Footer'
import Skills from '@/components/Skills'
import Button from '@/components/Button'

const FEATURED_PROJECT_IDS = ['4', '5'];

/* ── Parallax wrapper ── */
function ParallaxSection({
  children,
  speed = 0.3,
  className = '',
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

/* ── Scroll reveal ── */
function RevealOnScroll({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const heroRef = useRef(null)

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0])
  const heroScale = useTransform(heroScroll, [0, 0.5], [1, 0.9])
  const heroY = useTransform(heroScroll, [0, 0.5], [0, -60])

  const titles = useMemo(
    () => ['AI / ML Engineer', 'Backend Developer', 'MLOps Engineer'],
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
    <div className="w-full overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="text-center max-w-4xl z-10"
        >


          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10"
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

          {/* Typing effect in a pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-10 flex items-center justify-center mt-6 mb-6 relative z-10"
          >
            <div
              className="inline-flex items-center px-5 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-accent-cyan mr-3 pulse-glow" />
              <p className="text-base md:text-lg text-white/60 font-poppins relative">
                {displayText}
                <span className="absolute right-[-4px] top-0 h-full w-[2px] bg-accent-cyan animate-blink" />
              </p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-white/35 font-poppins text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed relative z-10"
          >
            Building intelligent systems at the intersection of AI, cloud infrastructure, and modern software engineering.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 relative z-10"
          >
            <Link href="/projects">
              <Button variant="primary">Explore Projects</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Enter the Singularity</Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/20 text-xs font-space tracking-widest">SCROLL</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-accent-cyan/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section className="relative py-32">
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(157,78,221,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <ParallaxSection speed={0.2}>
          <RevealOnScroll>
            <Skills />
          </RevealOnScroll>
        </ParallaxSection>
      </section>

      <div className="section-divider" />

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="relative py-32 px-4 sm:px-6">
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(102,252,241,0.04) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <ParallaxSection speed={0.15}>
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <p className="text-accent-cyan/50 font-space text-xs tracking-[0.3em] uppercase mb-3">Portfolio</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-space tracking-wide">
                  Featured Projects
                </h2>
                <p className="text-white/30 text-sm font-poppins mt-3 max-w-md mx-auto">
                  Exploring the boundaries of AI, data, and engineering
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects
                .filter((project) => FEATURED_PROJECT_IDS.includes(project.id))
                .map((project, index) => (
                  <RevealOnScroll key={project.id} delay={index * 0.15}>
                    <ProjectCard {...project} />
                  </RevealOnScroll>
                ))}
            </div>

            <RevealOnScroll delay={0.3}>
              <div className="text-center mt-12">
                <Link href="/projects">
                  <Button variant="primary">View All Projects</Button>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </ParallaxSection>
      </section>

      <div className="section-divider" />

      {/* ═══ FOOTER ═══ */}
      <section className="py-16">
        <RevealOnScroll>
          <Footer />
        </RevealOnScroll>
      </section>
    </div>
  )
}