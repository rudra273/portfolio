'use client'

import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const stars: { x: number; y: number; radius: number; opacity: number; speed: number; twinkleSpeed: number; twinkleOffset: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createStars = () => {
      stars.length = 0
      const count = Math.floor((canvas.width * canvas.height) / 3000)
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    const drawNebula = () => {
      // Purple nebula — top-left
      const g1 = ctx.createRadialGradient(
        canvas.width * 0.15, canvas.height * 0.2, 0,
        canvas.width * 0.15, canvas.height * 0.2, canvas.width * 0.4
      )
      g1.addColorStop(0, 'rgba(157, 78, 221, 0.04)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Blue nebula — center
      const g2 = ctx.createRadialGradient(
        canvas.width * 0.6, canvas.height * 0.5, 0,
        canvas.width * 0.6, canvas.height * 0.5, canvas.width * 0.35
      )
      g2.addColorStop(0, 'rgba(79, 70, 229, 0.03)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Cyan nebula — bottom-right
      const g3 = ctx.createRadialGradient(
        canvas.width * 0.85, canvas.height * 0.75, 0,
        canvas.width * 0.85, canvas.height * 0.75, canvas.width * 0.3
      )
      g3.addColorStop(0, 'rgba(102, 252, 241, 0.02)')
      g3.addColorStop(1, 'transparent')
      ctx.fillStyle = g3
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    let time = 0

    const animate = () => {
      time += 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Deep space background
      ctx.fillStyle = '#050816'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulas
      drawNebula()

      // Draw & twinkle stars
      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5
        const alpha = star.opacity * (0.4 + twinkle * 0.6)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()

        // Add glow for brighter stars
        if (star.radius > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(102, 252, 241, ${alpha * 0.08})`
          ctx.fill()
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    resize()
    createStars()
    animate()

    const handleResize = () => {
      resize()
      createStars()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
