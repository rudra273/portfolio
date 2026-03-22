'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { Planet1, AsteroidField, Planet2, Galaxy } from './SpaceEnvironment'
import * as THREE from 'three'

/* ─── Scroll-linked camera ─── */
function ScrollCamera() {
  const { camera } = useThree()
  const scrollRef = useRef(0)
  const targetRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      targetRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    // Smooth interpolation
    scrollRef.current += (targetRef.current - scrollRef.current) * 0.08

    const t = scrollRef.current
    // Camera flies from z=10 to z=-220
    camera.position.z = 10 - t * 230
    // Slight vertical drift
    camera.position.y = Math.sin(t * Math.PI) * 3
    // Gentle look-ahead tilt
    camera.rotation.x = t * -0.05
  })

  return null
}

/* ─── Star tunnel — distributed along flight path ─── */
function StarTunnel({ count = 8000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Spread in a cylinder along the Z axis
      const angle = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 45
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = 20 - Math.random() * 280 // z: +20 to -260
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    // Very slow rotation for life
    ref.current.rotation.z = state.clock.elapsedTime * 0.003
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.1}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  )
}

/* ─── Cyan cosmic dust ─── */
function CosmicDust({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 35
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = 15 - Math.random() * 260
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = -state.clock.elapsedTime * 0.005
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#66FCF1"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  )
}

/* ─── Purple accent dust ─── */
function PurpleDust({ count = 1500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 30
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = 10 - Math.random() * 250
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.004
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#9D4EDD"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.25}
      />
    </Points>
  )
}

/* ─── Nebula sprites placed at Z-depths ─── */
function NebulaCloud({ position, color, scale = 20 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.01
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ─── Speed lines that appear during scroll ─── */
function SpeedLines({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Group>(null)
  const scrollSpeed = useRef(0)
  const lastScroll = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      scrollSpeed.current = Math.abs(window.scrollY - lastScroll.current)
      lastScroll.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const lines = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 20
      arr.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 5 - Math.random() * 250,
        length: 0.5 + Math.random() * 2,
      })
    }
    return arr
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    // Fade lines based on scroll speed
    const intensity = Math.min(scrollSpeed.current / 30, 1)
    ref.current.children.forEach((child) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      if (mat) mat.opacity = intensity * 0.4
    })
    scrollSpeed.current *= 0.9 // decay
  })

  return (
    <group ref={ref}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, line.z]}>
          <boxGeometry args={[0.01, 0.01, line.length]} />
          <meshBasicMaterial
            color="#66FCF1"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Main scene ─── */
function SpaceScene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, -50]} intensity={0.5} color="#66FCF1" />
      <pointLight position={[-15, -5, -120]} intensity={0.3} color="#9D4EDD" />

      <ScrollCamera />
      <StarTunnel count={8000} />
      <CosmicDust count={3000} />
      <PurpleDust count={1500} />
      <SpeedLines count={150} />

      {/* Nebula clouds at various depths */}
      <NebulaCloud position={[-15, 8, -20]} color="#9D4EDD" scale={30} />
      <NebulaCloud position={[20, -5, -60]} color="#4F46E5" scale={25} />
      <NebulaCloud position={[-10, 5, -100]} color="#66FCF1" scale={35} />
      <NebulaCloud position={[15, -8, -150]} color="#9D4EDD" scale={28} />
      <NebulaCloud position={[-20, 10, -200]} color="#4F46E5" scale={40} />

      {/* 3D environment objects at scroll depths */}
      <Planet1 />
      <AsteroidField />
      <Planet2 />
      <Galaxy />

      <fog attach="fog" args={['#050816', 30, 80]} />
    </>
  )
}

export default function SpaceBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="fixed inset-0 z-0" style={{ background: '#050816' }} />

  return (
    <div className="fixed inset-0 z-0" style={{ background: '#050816' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 300 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none' }}
      >
        <SpaceScene />
      </Canvas>
    </div>
  )
}
