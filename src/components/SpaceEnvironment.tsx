'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Gas Giant Planet with Ring ─── */
function GasGiant({ position }: { position: [number, number, number] }) {
  const planetRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group position={position}>
      {/* Planet body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#2a1a4e"
          emissive="#9D4EDD"
          emissiveIntensity={0.15}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      {/* Atmospheric glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#9D4EDD"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Ring */}
      <mesh ref={ringRef} rotation={[1.2, 0.3, 0]}>
        <ringGeometry args={[4, 6, 64]} />
        <meshBasicMaterial
          color="#9D4EDD"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ─── Ice World Planet ─── */
function IceWorld({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#1a3a5c"
          emissive="#66FCF1"
          emissiveIntensity={0.1}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>
      {/* Atmospheric glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#66FCF1"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Point light for nearby illumination */}
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#66FCF1" distance={15} />
    </group>
  )
}

/* ─── Asteroid Belt ─── */
function AsteroidBelt({
  zStart = -60,
  zEnd = -80,
  count = 80,
}: {
  zStart?: number
  zEnd?: number
  count?: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  const asteroids = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 8 + Math.random() * 25
      arr.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 6,
          zStart + Math.random() * (zEnd - zStart),
        ] as [number, number, number],
        scale: 0.1 + Math.random() * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.3,
      })
    }
    return arr
  }, [count, zStart, zEnd])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.02
  })

  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid, i) => (
        <mesh key={i} position={asteroid.position} scale={asteroid.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#2a2a3a"
            emissive="#4F46E5"
            emissiveIntensity={0.05}
            roughness={0.9}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Distant Galaxy Sprite ─── */
function DistantGalaxy({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <group position={position}>
      {/* Galaxy disc */}
      <mesh ref={ref} rotation={[0.8, 0, 0]}>
        <ringGeometry args={[0.5, 8, 64]} />
        <meshBasicMaterial
          color="#66FCF1"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Core glow */}
      <mesh rotation={[0.8, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#66FCF1" distance={30} />
    </group>
  )
}

/* ─── Exported 3D environment ─── */
export function Planet1() {
  return <GasGiant position={[18, 3, -35]} />
}

export function AsteroidField() {
  return <AsteroidBelt zStart={-65} zEnd={-90} count={80} />
}

export function Planet2() {
  return <IceWorld position={[-14, -3, -130]} />
}

export function Galaxy() {
  return <DistantGalaxy position={[5, 2, -195]} />
}
