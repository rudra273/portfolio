'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import SpaceScene from './SpaceScene'

const fallbackBackground =
  'radial-gradient(circle at 18% 20%, rgba(31, 67, 129, 0.22), transparent 32%), radial-gradient(circle at 76% 18%, rgba(72, 35, 118, 0.22), transparent 28%), radial-gradient(circle at 52% 76%, rgba(10, 80, 74, 0.18), transparent 30%), linear-gradient(180deg, #030713 0%, #02050d 45%, #01030a 100%)'

export default function SpaceBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="fixed inset-0 z-0" style={{ background: fallbackBackground }} />
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: fallbackBackground }} />

      <Canvas
        camera={{ position: [0, 0, 15], fov: 46, near: 0.1, far: 260 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#02050d', 1)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.02
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
        style={{ pointerEvents: 'none' }}
      >
        <SpaceScene />
      </Canvas>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(1, 4, 10, 0.3) 0%, rgba(1, 4, 10, 0.08) 24%, rgba(1, 4, 10, 0.14) 56%, rgba(1, 4, 10, 0.42) 100%)',
        }}
      />
    </div>
  )
}
