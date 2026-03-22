'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Stars({ count = 4000, depth = 50 }: { count?: number; depth?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * depth * 2
      pos[i * 3 + 1] = (Math.random() - 0.5) * depth * 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * depth * 2
    }
    return pos
  }, [count, depth])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.015
    ref.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

function CosmicDust({ count = 1500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 5 + Math.random() * 30
      pos[i * 3] = Math.cos(theta) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = Math.sin(theta) * r
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#66FCF1"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  )
}

function FloatingRing() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3 + 0.5
    ref.current.rotation.z = state.clock.elapsedTime * 0.08
  })

  return (
    <mesh ref={ref} position={[6, 1, -12]}>
      <torusGeometry args={[3, 0.04, 16, 100]} />
      <meshBasicMaterial color="#9D4EDD" transparent opacity={0.25} />
    </mesh>
  )
}

function FloatingRing2() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.15) * 0.4 + 0.8
    ref.current.rotation.z = state.clock.elapsedTime * 0.05
  })

  return (
    <mesh ref={ref} position={[-8, -3, -15]}>
      <torusGeometry args={[2, 0.03, 16, 80]} />
      <meshBasicMaterial color="#66FCF1" transparent opacity={0.15} />
    </mesh>
  )
}

function GlowingSphere() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 + 2
    ref.current.rotation.y = state.clock.elapsedTime * 0.1
  })

  return (
    <mesh ref={ref} position={[-5, 2, -10]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshBasicMaterial color="#4F46E5" transparent opacity={0.12} wireframe />
    </mesh>
  )
}

function SpaceScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Stars count={5000} depth={60} />
      <CosmicDust count={2000} />
      <FloatingRing />
      <FloatingRing2 />
      <GlowingSphere />
      <fog attach="fog" args={['#050816', 20, 60]} />
    </>
  )
}

export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ background: '#050816' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none' }}
      >
        <SpaceScene />
      </Canvas>
    </div>
  )
}
