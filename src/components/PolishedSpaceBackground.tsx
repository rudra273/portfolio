'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

type StarLayerProps = {
  count: number
  size: number
  opacity: number
  spread: [number, number]
  depth: [number, number]
  tint: string
  rotationSpeed: number
  flightRef: React.MutableRefObject<FlightState>
  travel: number
}

type NebulaClusterProps = {
  anchor: [number, number, number]
  color: string
  scale: number
  density: number
  drift: number
}

type FlightState = {
  progress: number
  target: number
  velocity: number
}

function clampByte(value: number) {
  return Math.max(0, Math.min(255, value))
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

function smoothStep(value: number, start: number, end: number) {
  const amount = clamp((value - start) / (end - start), 0, 1)
  return amount * amount * (3 - 2 * amount)
}

function createCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const fallback = new THREE.Texture()
    fallback.needsUpdate = true
    return fallback
  }

  draw(ctx, canvas)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function createGlowTexture() {
  return createCanvasTexture(768, 768, (ctx, canvas) => {
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)

    const core = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width * 0.45
    )
    core.addColorStop(0, 'rgba(255, 255, 255, 1)')
    core.addColorStop(0.14, 'rgba(255, 255, 255, 0.45)')
    core.addColorStop(0.38, 'rgba(255, 255, 255, 0.1)')
    core.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = core
    ctx.fillRect(0, 0, width, height)
  })
}

function createStarPointTexture() {
  return createCanvasTexture(128, 128, (ctx, canvas) => {
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)

    const star = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width * 0.48
    )
    star.addColorStop(0, 'rgba(255, 255, 255, 1)')
    star.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)')
    star.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)')
    star.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = star
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, width * 0.48, 0, Math.PI * 2)
    ctx.fill()
  })
}

function createAccretionDiskTexture() {
  return createCanvasTexture(1400, 1400, (ctx, canvas) => {
    const { width, height } = canvas
    const cx = width / 2
    const cy = height / 2

    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'screen'

    const haze = ctx.createRadialGradient(cx, cy, width * 0.18, cx, cy, width * 0.42)
    haze.addColorStop(0, 'rgba(255, 244, 212, 0.12)')
    haze.addColorStop(0.45, 'rgba(255, 190, 112, 0.08)')
    haze.addColorStop(1, 'rgba(255, 160, 92, 0)')
    ctx.fillStyle = haze
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < 460; i++) {
      const radius = width * (0.2 + Math.random() * 0.17)
      const start = Math.random() * Math.PI * 2
      const length = 0.18 + Math.random() * 1.25
      const sideBoost = Math.cos(start - Math.PI * 0.18) * 0.5 + 0.5
      const alpha = 0.016 + sideBoost * 0.05 + Math.random() * 0.03
      const lineWidth = 1 + Math.random() * 7

      ctx.beginPath()
      ctx.lineWidth = lineWidth
      ctx.strokeStyle =
        radius < width * 0.255
          ? `rgba(255, 247, 226, ${alpha})`
          : radius < width * 0.31
            ? `rgba(255, 192, 114, ${alpha * 0.95})`
            : `rgba(112, 184, 255, ${alpha * 0.68})`
      ctx.arc(cx, cy, radius, start, start + length)
      ctx.stroke()
    }

    for (let i = 0; i < 100; i++) {
      const arcRadius = width * (0.22 + Math.random() * 0.12)
      const angle = Math.random() * Math.PI * 2
      const glowX = cx + Math.cos(angle) * arcRadius
      const glowY = cy + Math.sin(angle) * arcRadius
      const glowRadius = 12 + Math.random() * 36
      const puff = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius)
      puff.addColorStop(0, 'rgba(255, 236, 204, 0.2)')
      puff.addColorStop(0.45, 'rgba(255, 180, 96, 0.08)')
      puff.addColorStop(1, 'rgba(255, 180, 96, 0)')
      ctx.fillStyle = puff
      ctx.fillRect(glowX - glowRadius, glowY - glowRadius, glowRadius * 2, glowRadius * 2)
    }

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(cx, cy, width * 0.17, 0, Math.PI * 2)
    ctx.fill()
  })
}

function createNebulaTexture() {
  return createCanvasTexture(1024, 1024, (ctx, canvas) => {
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'screen'

    for (let i = 0; i < 90; i++) {
      const x = width * (0.18 + Math.random() * 0.64)
      const y = height * (0.18 + Math.random() * 0.64)
      const radius = width * (0.08 + Math.random() * 0.18)
      const alpha = 0.03 + Math.random() * 0.08
      const puff = ctx.createRadialGradient(x, y, 0, x, y, radius)

      puff.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      puff.addColorStop(0.45, `rgba(255, 255, 255, ${alpha * 0.45})`)
      puff.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = puff
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }
  })
}

function createGasGiantTexture() {
  return createCanvasTexture(1600, 800, (ctx, canvas) => {
    const { width, height } = canvas

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#140f23')
    gradient.addColorStop(0.2, '#2b1d41')
    gradient.addColorStop(0.42, '#56406f')
    gradient.addColorStop(0.58, '#8c7aa6')
    gradient.addColorStop(0.74, '#4f6a8b')
    gradient.addColorStop(1, '#171728')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    const bandColors = [
      'rgba(247, 243, 255, 0.08)',
      'rgba(185, 203, 255, 0.08)',
      'rgba(126, 161, 214, 0.08)',
      'rgba(92, 57, 136, 0.11)',
      'rgba(42, 24, 78, 0.12)',
    ]

    for (let i = 0; i < 280; i++) {
      const y = Math.random() * height
      const bandHeight = 2 + Math.random() * 18
      ctx.fillStyle = bandColors[Math.floor(Math.random() * bandColors.length)]
      ctx.fillRect(0, y, width, bandHeight)
    }

    for (let i = 0; i < 18; i++) {
      const x = Math.random() * width
      const y = height * (0.18 + Math.random() * 0.64)
      const stormWidth = 90 + Math.random() * 220
      const stormHeight = 26 + Math.random() * 60
      const storm = ctx.createRadialGradient(x, y, 0, x, y, stormWidth)
      storm.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
      storm.addColorStop(0.45, 'rgba(230, 235, 255, 0.04)')
      storm.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = storm
      ctx.beginPath()
      ctx.ellipse(x, y, stormWidth, stormHeight, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }

    const imageData = ctx.getImageData(0, 0, width, height)
    const { data } = imageData
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16
      data[i] = clampByte(data[i] + noise)
      data[i + 1] = clampByte(data[i + 1] + noise)
      data[i + 2] = clampByte(data[i + 2] + noise * 0.85)
    }
    ctx.putImageData(imageData, 0, 0)
  })
}

function createGasGiantCloudTexture() {
  return createCanvasTexture(1600, 800, (ctx, canvas) => {
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < 130; i++) {
      const y = Math.random() * height
      const bandHeight = 1 + Math.random() * 10
      const alpha = 0.02 + Math.random() * 0.05
      const band = ctx.createLinearGradient(0, y, 0, y + bandHeight)
      band.addColorStop(0, 'rgba(255, 255, 255, 0)')
      band.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`)
      band.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = band
      ctx.fillRect(0, y, width, bandHeight)
    }
  })
}

function createRockyPlanetTexture() {
  return createCanvasTexture(1200, 600, (ctx, canvas) => {
    const { width, height } = canvas

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#142130')
    gradient.addColorStop(0.35, '#22364c')
    gradient.addColorStop(0.58, '#5e718a')
    gradient.addColorStop(0.8, '#39495f')
    gradient.addColorStop(1, '#121a29')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < 160; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = 18 + Math.random() * 50
      const patch = ctx.createRadialGradient(x, y, 0, x, y, radius)
      patch.addColorStop(0, 'rgba(186, 219, 255, 0.08)')
      patch.addColorStop(0.45, 'rgba(70, 103, 145, 0.07)')
      patch.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = patch
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }

    const imageData = ctx.getImageData(0, 0, width, height)
    const { data } = imageData
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20
      data[i] = clampByte(data[i] + noise * 0.75)
      data[i + 1] = clampByte(data[i + 1] + noise)
      data[i + 2] = clampByte(data[i + 2] + noise * 1.1)
    }
    ctx.putImageData(imageData, 0, 0)
  })
}

function createRingTexture() {
  const texture = createCanvasTexture(1600, 120, (ctx, canvas) => {
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)

    for (let y = 0; y < height; y++) {
      const distance = Math.abs(y / height - 0.5) * 2
      const density = Math.max(0, 1 - distance * distance)
      const red = 172 + Math.sin(y * 0.18) * 16
      const green = 164 + Math.cos(y * 0.22) * 18
      const blue = 218 + Math.sin(y * 0.13 + 1.2) * 20
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${density * 0.38})`
      ctx.fillRect(0, y, width, 1)
    }

    for (let i = 0; i < 1600; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const streak = 8 + Math.random() * 40
      const alpha = 0.03 + Math.random() * 0.08
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fillRect(x, y, streak, 1)
    }

    for (let i = 0; i < 180; i++) {
      const y = Math.random() * height
      const gapHeight = 1 + Math.random() * 2
      const gapAlpha = 0.04 + Math.random() * 0.12
      ctx.fillStyle = `rgba(0, 0, 0, ${gapAlpha})`
      ctx.fillRect(0, y, width, gapHeight)
    }
  })

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.repeat.set(1.75, 1)

  return texture
}

function CameraRig({ flightRef }: { flightRef: React.MutableRefObject<FlightState> }) {
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * -2
    }

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      flightRef.current.target = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [flightRef])

  useFrame((_, delta) => {
    const springPull = (flightRef.current.target - flightRef.current.progress) * 26
    flightRef.current.velocity += springPull * delta
    flightRef.current.velocity *= Math.exp(-8.5 * delta)

    const previousProgress = flightRef.current.progress
    let nextProgress = previousProgress + flightRef.current.velocity * delta

    const crossedTarget =
      (flightRef.current.target - previousProgress) *
        (flightRef.current.target - nextProgress) <
      0

    if (crossedTarget) {
      nextProgress = flightRef.current.target
      flightRef.current.velocity = 0
    }

    flightRef.current.progress = clamp(nextProgress, 0, 1)

    const travel = flightRef.current.progress
    const driftX = pointer.current.x * 0.9 - travel * 2.05
    const driftY = pointer.current.y * 0.78 - travel * 5.2
    const driftZ = 18 - travel * 44

    camera.position.x = THREE.MathUtils.damp(camera.position.x, driftX, 2.2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, driftY, 2.2, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, driftZ, 2.2, delta)

    camera.lookAt(
      pointer.current.x * 2.1 - travel * 0.8,
      pointer.current.y * 0.42 - travel * 4.5,
      -90 - travel * 36
    )
  })

  return null
}

function StarLayer({
  count,
  size,
  opacity,
  spread,
  depth,
  tint,
  rotationSpeed,
  flightRef,
  travel,
}: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const pulseOffset = useMemo(() => Math.random() * Math.PI * 2, [])
  const starTexture = useMemo(() => createStarPointTexture(), [])

  const { basePositions, positions, colors, speeds, drifts } = useMemo(() => {
    const baseColor = new THREE.Color(tint)
    const basePositionsArray = new Float32Array(count * 3)
    const positionsArray = new Float32Array(count * 3)
    const colorsArray = new Float32Array(count * 3)
    const speedsArray = new Float32Array(count)
    const driftsArray = new Float32Array(count * 2)

    for (let i = 0; i < count; i++) {
      const index = i * 3
      basePositionsArray[index] = (Math.random() - 0.5) * spread[0]
      basePositionsArray[index + 1] = (Math.random() - 0.5) * spread[1]
      basePositionsArray[index + 2] =
        depth[0] + Math.random() * (depth[1] - depth[0])

      positionsArray[index] = basePositionsArray[index]
      positionsArray[index + 1] = basePositionsArray[index + 1]
      positionsArray[index + 2] = basePositionsArray[index + 2]

      speedsArray[i] = 0.85 + Math.random() * 0.65
      driftsArray[i * 2] = (Math.random() - 0.5) * 0.2
      driftsArray[i * 2 + 1] = (Math.random() - 0.5) * 0.16

      const color = baseColor.clone()
      color.offsetHSL(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.18
      )

      colorsArray[index] = color.r
      colorsArray[index + 1] = color.g
      colorsArray[index + 2] = color.b
    }

    return {
      basePositions: basePositionsArray,
      positions: positionsArray,
      colors: colorsArray,
      speeds: speedsArray,
      drifts: driftsArray,
    }
  }, [count, depth, spread, tint])

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * rotationSpeed
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.02
    }

    if (geometryRef.current) {
      const progress = flightRef.current.progress
      const warpBoost = Math.min(Math.abs(flightRef.current.velocity) * 11, 0.6)
      const positionAttribute = geometryRef.current.attributes.position as THREE.BufferAttribute
      const positionArray = positionAttribute.array as Float32Array
      const wrapCeiling = 16
      const wrapRange = wrapCeiling - depth[1] + 14

      for (let i = 0; i < count; i++) {
        const index = i * 3
        const baseX = basePositions[index]
        const baseY = basePositions[index + 1]
        const baseZ = basePositions[index + 2]
        const travelDepth = progress * travel * speeds[i]

        let z = baseZ + travelDepth
        while (z > wrapCeiling) z -= wrapRange
        while (z < depth[1]) z += wrapRange

        positionArray[index] = baseX + drifts[i * 2] * progress * 18
        positionArray[index + 1] = baseY + drifts[i * 2 + 1] * progress * 14
        positionArray[index + 2] = z
      }

      positionAttribute.needsUpdate = true

      if (materialRef.current) {
        const pulse =
          0.92 + Math.sin(state.clock.elapsedTime * 0.22 + pulseOffset) * 0.08
        materialRef.current.opacity = opacity * pulse * (1 + warpBoost)
      }
    }

    if (materialRef.current) {
      materialRef.current.size = size * (1 + Math.min(Math.abs(flightRef.current.velocity) * 3.2, 0.18))
    }
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={starTexture}
        alphaMap={starTexture}
        alphaTest={0.02}
        toneMapped={false}
      />
    </points>
  )
}

function WarpLines({ flightRef, count = 42 }: { flightRef: React.MutableRefObject<FlightState>; count?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  const lines = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 10,
        z: -14 - Math.random() * 110,
        minZ: -124 - Math.random() * 20,
        length: 0.7 + Math.random() * 1.6,
        opacity: 0.05 + Math.random() * 0.09,
        color: Math.random() > 0.5 ? '#a6ddff' : '#8ff2ff',
        travel: 140 + Math.random() * 80,
      })),
    [count]
  )

  useFrame(() => {
    if (!groupRef.current) return

    const intensity = Math.min(Math.abs(flightRef.current.velocity) * 18, 1)

    groupRef.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh
      const material = mesh.material as THREE.MeshBasicMaterial
      const line = lines[index]
      const wrapCeiling = 16
      const wrapRange = wrapCeiling - line.minZ + 12

      let z = line.z + flightRef.current.progress * line.travel
      while (z > wrapCeiling) z -= wrapRange
      while (z < line.minZ) z += wrapRange

      mesh.position.set(line.x, line.y, z)
      mesh.scale.z = 0.8 + intensity * line.length * 9
      material.opacity = intensity * line.opacity
    })
  })

  return (
    <group ref={groupRef}>
      {lines.map((line, index) => (
        <mesh key={index} position={[line.x, line.y, line.z]}>
          <boxGeometry args={[0.012, 0.012, 1]} />
          <meshBasicMaterial
            color={line.color}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function FeatureStars({ flightRef }: { flightRef: React.MutableRefObject<FlightState> }) {
  const glowTexture = useMemo(() => createGlowTexture(), [])
  const groupRef = useRef<THREE.Group>(null)

  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        position: [
          (Math.random() - 0.5) * 78,
          (Math.random() - 0.5) * 44,
          -14 - Math.random() * 70,
        ] as [number, number, number],
        scale: 0.55 + Math.random() * 1.4,
        opacity: 0.12 + Math.random() * 0.18,
        color:
          Math.random() > 0.7
            ? '#ffe4c4'
            : Math.random() > 0.45
              ? '#d9ecff'
              : '#ffffff',
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.06) * 0.015
    groupRef.current.position.z = flightRef.current.progress * 12
  })

  return (
    <group ref={groupRef}>
      {stars.map((star, index) => (
        <sprite key={index} position={star.position} scale={[star.scale, star.scale, 1]}>
          <spriteMaterial
            map={glowTexture}
            color={star.color}
            transparent
            opacity={star.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  )
}

function NebulaCluster({
  anchor,
  color,
  scale,
  density,
  drift,
  flightRef,
}: NebulaClusterProps & { flightRef: React.MutableRefObject<FlightState> }) {
  const texture = useMemo(() => createNebulaTexture(), [])
  const groupRef = useRef<THREE.Group>(null)

  const sprites = useMemo(
    () =>
      Array.from({ length: density }, () => {
        const radius = scale * (0.14 + Math.random() * 0.5)
        const angle = Math.random() * Math.PI * 2
        const lift = (Math.random() - 0.5) * scale * 0.34
        const depthOffset = (Math.random() - 0.5) * scale * 0.2
        const puffScale = scale * (0.32 + Math.random() * 0.68)

        return {
          position: [
            Math.cos(angle) * radius * 1.25,
            lift,
            Math.sin(angle) * radius * 0.55 + depthOffset,
          ] as [number, number, number],
          scale: [puffScale * 1.4, puffScale, 1] as [number, number, number],
          opacity: 0.03 + Math.random() * 0.06,
        }
      }),
    [density, scale]
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const progress = flightRef.current.progress

    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * drift) * 0.09
    groupRef.current.position.x =
      anchor[0] + Math.sin(state.clock.elapsedTime * drift * 0.7) * 0.6 - progress * 0.8
    groupRef.current.position.y =
      anchor[1] + Math.cos(state.clock.elapsedTime * drift * 0.6) * 0.35 - progress * 0.4
    groupRef.current.position.z = anchor[2] + progress * 10
  })

  return (
    <group ref={groupRef} position={anchor}>
      {sprites.map((sprite, index) => (
        <sprite key={index} position={sprite.position} scale={sprite.scale}>
          <spriteMaterial
            map={texture}
            color={color}
            transparent
            opacity={sprite.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  )
}

function BackgroundGlows() {
  const glowTexture = useMemo(() => createGlowTexture(), [])

  return (
    <group>
      <sprite position={[0, -5, -98]} scale={[74, 74, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#0d5a52"
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[-24, 14, -112]} scale={[48, 48, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#1b3369"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[26, 10, -90]} scale={[56, 56, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#4d266d"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
}

function SpiralGalaxy({ flightRef }: { flightRef: React.MutableRefObject<FlightState> }) {
  const groupRef = useRef<THREE.Group>(null)
  const glowTexture = useMemo(() => createGlowTexture(), [])
  const starTexture = useMemo(() => createStarPointTexture(), [])

  const { positions, colors } = useMemo(() => {
    const count = 640
    const branches = 4
    const positionsArray = new Float32Array(count * 3)
    const colorsArray = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const radius = Math.pow(Math.random(), 1.15) * 11
      const branchAngle = ((i % branches) / branches) * Math.PI * 2
      const spin = radius * 1.15
      const noise = (Math.random() - 0.5) * 1.2
      const angle = branchAngle + spin + noise

      positionsArray[index] = Math.cos(angle) * radius
      positionsArray[index + 1] = (Math.random() - 0.5) * 0.9
      positionsArray[index + 2] = Math.sin(angle) * radius * 0.42

      const color = new THREE.Color('#d7e7ff')
      color.offsetHSL(
        (Math.random() - 0.5) * 0.05,
        Math.random() * 0.12,
        (Math.random() - 0.5) * 0.16
      )

      colorsArray[index] = color.r
      colorsArray[index + 1] = color.g
      colorsArray[index + 2] = color.b
    }

    return { positions: positionsArray, colors: colorsArray }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const progress = flightRef.current.progress
    groupRef.current.rotation.z += delta * 0.016
    groupRef.current.position.x = mix(-26, -18, smoothStep(progress, 0.24, 0.58))
    groupRef.current.position.z = mix(-148, -104, smoothStep(progress, 0.24, 0.58))
    groupRef.current.scale.setScalar(mix(0.92, 1.1, smoothStep(progress, 0.24, 0.58)))
  })

  return (
    <group ref={groupRef} position={[-22, 13, -122]} rotation={[1.22, 0.28, 0.42]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.11}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={starTexture}
          alphaMap={starTexture}
          alphaTest={0.02}
          toneMapped={false}
        />
      </points>

      <sprite position={[0, 0, 0]} scale={[7.5, 7.5, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffffff"
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <sprite position={[0, 0, 0]} scale={[16, 16, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#5f82ff"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
}

function RingedPlanet({ flightRef }: { flightRef: React.MutableRefObject<FlightState> }) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const cloudRef = useRef<THREE.Mesh>(null)
  const moonOrbitRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  const planetTexture = useMemo(() => createGasGiantTexture(), [])
  const cloudTexture = useMemo(() => createGasGiantCloudTexture(), [])
  const ringTexture = useMemo(() => createRingTexture(), [])
  const glowTexture = useMemo(() => createGlowTexture(), [])

  const compactViewport = viewport.width < 8.5
  const position = useMemo<[number, number, number]>(
    () => [
      compactViewport ? viewport.width * 0.64 : viewport.width * 0.74,
      compactViewport ? viewport.height * 0.12 : viewport.height * 0.08,
      -58,
    ],
    [compactViewport, viewport.height, viewport.width]
  )
  const scale = compactViewport ? 0.58 : 0.84
  const ringRotation = useMemo<[number, number, number]>(() => [1.48, 0.16, -0.48], [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      const progress = flightRef.current.progress
      const pass = smoothStep(progress, 0.02, 0.42)
      const liveX = mix(
        compactViewport ? viewport.width * 0.62 : viewport.width * 0.68,
        compactViewport ? viewport.width * 1.24 : viewport.width * 1.38,
        pass
      )
      const liveY = mix(
        compactViewport ? viewport.height * 0.08 : viewport.height * 0.02,
        compactViewport ? -viewport.height * 0.02 : -viewport.height * 0.08,
        pass
      )
      const liveZ = mix(-118, 34, pass)
      const liveScale = mix(0.56, 2.35, pass)

      groupRef.current.position.x = liveX + Math.sin(state.clock.elapsedTime * 0.08) * 0.3
      groupRef.current.position.y = liveY + Math.cos(state.clock.elapsedTime * 0.1) * 0.16
      groupRef.current.position.z = liveZ
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.025
      groupRef.current.scale.setScalar(scale * liveScale)
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.045
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.06
    }

    if (moonOrbitRef.current) {
      moonOrbitRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <sprite position={[-2.6, 0.5, -8]} scale={[24, 24, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#4b2c75"
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <mesh ref={planetRef}>
        <sphereGeometry args={[6.8, 96, 96]} />
        <meshStandardMaterial
          map={planetTexture}
          roughness={0.96}
          metalness={0.02}
          emissive="#10091f"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh ref={cloudRef} scale={1.012}>
        <sphereGeometry args={[6.82, 96, 96]} />
        <meshStandardMaterial
          map={cloudTexture}
          alphaMap={cloudTexture}
          transparent
          opacity={0.34}
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <sprite position={[0.5, -0.15, -5]} scale={[18, 18, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#8eb9ff"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <mesh rotation={ringRotation}>
        <ringGeometry args={[8.9, 13.9, 180]} />
        <meshBasicMaterial
          map={ringTexture}
          alphaMap={ringTexture}
          color="#d3c5ff"
          transparent
          opacity={0.48}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <group ref={moonOrbitRef}>
        <mesh position={[-10.8, -2.2, 4.6]}>
          <sphereGeometry args={[1.12, 48, 48]} />
          <meshStandardMaterial
            color="#9fb7d9"
            roughness={0.95}
            metalness={0.02}
            emissive="#2f4964"
            emissiveIntensity={0.06}
          />
        </mesh>
      </group>
    </group>
  )
}

function IcePlanet({ flightRef }: { flightRef: React.MutableRefObject<FlightState> }) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const texture = useMemo(() => createRockyPlanetTexture(), [])
  const glowTexture = useMemo(() => createGlowTexture(), [])

  const position = useMemo<[number, number, number]>(
    () => [-viewport.width * 0.56, -viewport.height * 0.3, -78],
    [viewport.height, viewport.width]
  )
  const scale = viewport.width < 8.5 ? 0.7 : 0.86

  useFrame((state, delta) => {
    if (groupRef.current) {
      const progress = flightRef.current.progress
      const appear = smoothStep(progress, 0.36, 0.9)
      const liveX = mix(-viewport.width * 1.08, -viewport.width * 0.54, appear)
      const liveY = mix(position[1] + viewport.height * 0.16, position[1] - viewport.height * 0.04, appear)
      const liveZ = mix(-170, -18, appear)
      const liveScale = mix(0.18, 1.18, appear)

      groupRef.current.position.x =
        liveX + Math.cos(state.clock.elapsedTime * 0.07) * 0.18
      groupRef.current.position.y =
        liveY + Math.sin(state.clock.elapsedTime * 0.09) * 0.12
      groupRef.current.position.z = liveZ
      groupRef.current.scale.setScalar(scale * liveScale)
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.03
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <sprite position={[0.8, 0, -5]} scale={[12, 12, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#24547d"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <mesh ref={planetRef}>
        <sphereGeometry args={[3.2, 72, 72]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.95}
          metalness={0.02}
          emissive="#112338"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh scale={1.08}>
        <sphereGeometry args={[3.36, 72, 72]} />
        <meshBasicMaterial
          color="#90d5ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function StarClusterNode({
  flightRef,
  anchor,
  color,
  radius,
  count,
  revealStart,
  revealEnd,
  drift,
}: {
  flightRef: React.MutableRefObject<FlightState>
  anchor: [number, number, number]
  color: string
  radius: number
  count: number
  revealStart: number
  revealEnd: number
  drift: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const starTexture = useMemo(() => createStarPointTexture(), [])
  const glowTexture = useMemo(() => createGlowTexture(), [])

  const { positions, colors } = useMemo(() => {
    const positionsArray = new Float32Array(count * 3)
    const colorsArray = new Float32Array(count * 3)
    const baseColor = new THREE.Color(color)

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const radial = Math.pow(Math.random(), 1.8) * radius
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(1 - Math.random() * 2)

      positionsArray[index] = Math.sin(phi) * Math.cos(theta) * radial
      positionsArray[index + 1] = Math.cos(phi) * radial * 0.7
      positionsArray[index + 2] = Math.sin(phi) * Math.sin(theta) * radial

      const sample = baseColor.clone()
      sample.offsetHSL(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.18
      )

      colorsArray[index] = sample.r
      colorsArray[index + 1] = sample.g
      colorsArray[index + 2] = sample.b
    }

    return { positions: positionsArray, colors: colorsArray }
  }, [color, count, radius])

  useFrame((state) => {
    const reveal = smoothStep(flightRef.current.progress, revealStart, revealEnd)

    if (groupRef.current) {
      groupRef.current.position.x =
        mix(anchor[0] - 2.5, anchor[0], reveal) + Math.sin(state.clock.elapsedTime * drift) * 0.35
      groupRef.current.position.y =
        mix(anchor[1] + 1.5, anchor[1], reveal) + Math.cos(state.clock.elapsedTime * drift * 1.1) * 0.22
      groupRef.current.position.z = mix(anchor[2] - 44, anchor[2] + 20, reveal)
      groupRef.current.rotation.z += 0.0008
      groupRef.current.scale.setScalar(mix(0.22, 1.08, reveal))
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.72 * reveal
      materialRef.current.size = 0.09 + reveal * 0.02
    }
  })

  return (
    <group ref={groupRef} position={anchor}>
      <sprite position={[0, 0, -8]} scale={[radius * 4.8, radius * 4.8, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={color}
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.1}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={starTexture}
          alphaMap={starTexture}
          alphaTest={0.02}
          toneMapped={false}
        />
      </points>
    </group>
  )
}

function DeepFieldGalaxy({
  flightRef,
  anchor,
  start,
  end,
  scale = 1,
  tint = '#d7e7ff',
}: {
  flightRef: React.MutableRefObject<FlightState>
  anchor: [number, number, number]
  start: number
  end: number
  scale?: number
  tint?: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const glowTexture = useMemo(() => createGlowTexture(), [])
  const starTexture = useMemo(() => createStarPointTexture(), [])

  const { positions, colors } = useMemo(() => {
    const count = 320
    const branches = 3
    const positionsArray = new Float32Array(count * 3)
    const colorsArray = new Float32Array(count * 3)
    const inner = new THREE.Color(tint)
    const outer = new THREE.Color('#8ab5ff')

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const radius = Math.pow(Math.random(), 1.2) * 7.5
      const branch = ((i % branches) / branches) * Math.PI * 2
      const angle = branch + radius * 1.4 + (Math.random() - 0.5) * 0.8

      positionsArray[index] = Math.cos(angle) * radius
      positionsArray[index + 1] = (Math.random() - 0.5) * 0.7
      positionsArray[index + 2] = Math.sin(angle) * radius * 0.36

      const sample = inner.clone().lerp(outer, radius / 7.5)
      sample.offsetHSL(0, Math.random() * 0.08, (Math.random() - 0.5) * 0.12)

      colorsArray[index] = sample.r
      colorsArray[index + 1] = sample.g
      colorsArray[index + 2] = sample.b
    }

    return { positions: positionsArray, colors: colorsArray }
  }, [tint])

  useFrame((_, delta) => {
    const reveal = smoothStep(flightRef.current.progress, start, end)

    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.01
      groupRef.current.position.z = mix(anchor[2] - 38, anchor[2] + 10, reveal)
      groupRef.current.scale.setScalar(scale * mix(0.34, 1, reveal))
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.64 * reveal
    }
  })

  return (
    <group ref={groupRef} position={anchor} rotation={[1.18, 0.18, 0.36]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.09}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={starTexture}
          alphaMap={starTexture}
          alphaTest={0.02}
          toneMapped={false}
        />
      </points>

      <sprite position={[0, 0, 0]} scale={[6.2, 6.2, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffffff"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
}

function BlackHolePhenomenon({ flightRef }: { flightRef: React.MutableRefObject<FlightState> }) {
  const groupRef = useRef<THREE.Group>(null)
  const diskMaterialRef = useRef<THREE.PointsMaterial>(null)
  const diskGeometryRef = useRef<THREE.BufferGeometry>(null)
  const glowTexture = useMemo(() => createGlowTexture(), [])
  const starTexture = useMemo(() => createStarPointTexture(), [])
  const accretionDiskTexture = useMemo(() => createAccretionDiskTexture(), [])
  const { viewport } = useThree()

  const { positions, colors, radii, angles, heights, speeds, phases } = useMemo(() => {
    const count = 760
    const positionsArray = new Float32Array(count * 3)
    const colorsArray = new Float32Array(count * 3)
    const radiiArray = new Float32Array(count)
    const anglesArray = new Float32Array(count)
    const heightsArray = new Float32Array(count)
    const speedsArray = new Float32Array(count)
    const phasesArray = new Float32Array(count)

    const inner = new THREE.Color('#e9f7ff')
    const mid = new THREE.Color('#7bc2ff')
    const outer = new THREE.Color('#ff9b5c')

    for (let i = 0; i < count; i++) {
      const index = i * 3
      const radius = 4.4 + Math.pow(Math.random(), 0.9) * 9.6
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * (0.08 + radius * 0.05)
      const speed = 2.8 / Math.pow(radius, 1.12)
      const phase = Math.random() * Math.PI * 2

      radiiArray[i] = radius
      anglesArray[i] = angle
      heightsArray[i] = height
      speedsArray[i] = speed
      phasesArray[i] = phase

      positionsArray[index] = Math.cos(angle) * radius
      positionsArray[index + 1] = height
      positionsArray[index + 2] = Math.sin(angle) * radius * 0.34

      const t = (radius - 4.4) / 9.6
      const sample = inner.clone().lerp(mid, Math.min(t * 1.3, 1))
      if (t > 0.55) {
        sample.lerp(outer, (t - 0.55) / 0.45)
      }

      colorsArray[index] = sample.r
      colorsArray[index + 1] = sample.g
      colorsArray[index + 2] = sample.b
    }

    return {
      positions: positionsArray,
      colors: colorsArray,
      radii: radiiArray,
      angles: anglesArray,
      heights: heightsArray,
      speeds: speedsArray,
      phases: phasesArray,
    }
  }, [])

  useFrame((state, delta) => {
    const reveal = smoothStep(flightRef.current.progress, 0.72, 0.98)

    if (groupRef.current) {
      groupRef.current.position.x = mix(viewport.width * 0.2, 0.4, reveal)
      groupRef.current.position.y = mix(viewport.height * 0.2, -0.9, reveal)
      groupRef.current.position.z = mix(-236, -62, reveal)
      groupRef.current.scale.setScalar(mix(0.12, 1.32, reveal))
      groupRef.current.rotation.z += delta * 0.02
    }

    if (diskGeometryRef.current) {
      const positionAttribute = diskGeometryRef.current.attributes.position as THREE.BufferAttribute
      const positionArray = positionAttribute.array as Float32Array

      for (let i = 0; i < radii.length; i++) {
        const index = i * 3
        angles[i] += delta * speeds[i] * (0.8 + reveal * 5.5)

        const radiusPulse = 1 + Math.sin(state.clock.elapsedTime * 0.7 + phases[i]) * 0.025
        const localRadius = radii[i] * radiusPulse
        const vertical = heights[i] + Math.sin(angles[i] * 2.4 + phases[i]) * 0.08

        positionArray[index] = Math.cos(angles[i]) * localRadius
        positionArray[index + 1] = vertical
        positionArray[index + 2] = Math.sin(angles[i]) * localRadius * 0.32
      }

      positionAttribute.needsUpdate = true
    }

    if (diskMaterialRef.current) {
      diskMaterialRef.current.opacity = 0.04 + reveal * 0.34
      diskMaterialRef.current.size = 0.072 + reveal * 0.04
    }
  })

  return (
    <group ref={groupRef} position={[4, -1.5, -220]} rotation={[0.14, 0.18, 0.06]}>
      <sprite position={[0, 0, -16]} scale={[42, 42, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#102540"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <group rotation={[1.24, 0.18, 0.12]}>
        <mesh scale={[1.02, 1.02, 1]}>
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial
            map={accretionDiskTexture}
            alphaMap={accretionDiskTexture}
            color="#ffe2bf"
            transparent
            opacity={0.78}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        <mesh position={[0, 0, -0.8]} scale={[1.08, 1.08, 1]}>
          <planeGeometry args={[31.5, 31.5]} />
          <meshBasicMaterial
            map={accretionDiskTexture}
            alphaMap={accretionDiskTexture}
            color="#74bbff"
            transparent
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        <points>
          <bufferGeometry ref={diskGeometryRef}>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={diskMaterialRef}
            size={0.12}
            vertexColors
            transparent
            opacity={0}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            map={starTexture}
            alphaMap={starTexture}
            alphaTest={0.02}
            toneMapped={false}
          />
        </points>
      </group>

      <mesh>
        <sphereGeometry args={[4.6, 72, 72]} />
        <meshBasicMaterial color="#010103" />
      </mesh>

      <mesh scale={1.04}>
        <sphereGeometry args={[4.85, 72, 72]} />
        <meshBasicMaterial
          color="#07101a"
          transparent
          opacity={0.22}
          depthWrite={false}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.86, 5.08, 128]} />
        <meshBasicMaterial
          color="#fff3cf"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <sprite position={[0, 0, 2]} scale={[11, 11, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#ffd9ac"
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <sprite position={[0, 0, -2]} scale={[18, 18, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#5cb6ff"
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      <pointLight position={[0, 0, 0]} intensity={1.4} color="#ffb06d" distance={38} />
    </group>
  )
}

function SpaceScene() {
  const flightRef = useRef<FlightState>({
    progress: 0,
    target: 0,
    velocity: 0,
  })

  return (
    <>
      <color attach="background" args={['#02050d']} />
      <fogExp2 attach="fog" args={['#02050d', 0.012]} />

      <ambientLight intensity={0.28} />
      <hemisphereLight args={['#9bd4ff', '#05080e', 0.35]} />
      <directionalLight position={[8, 12, 18]} intensity={1.05} color="#dcecff" />
      <pointLight position={[20, 10, 10]} intensity={1.2} distance={140} color="#79d4ff" />
      <pointLight position={[-16, -8, -12]} intensity={0.55} distance={110} color="#7043c9" />

      <CameraRig flightRef={flightRef} />

      <BackgroundGlows />

      <NebulaCluster anchor={[-28, 12, -96]} color="#18396b" scale={16} density={12} drift={0.08} flightRef={flightRef} />
      <NebulaCluster anchor={[22, -9, -88]} color="#0f5f58" scale={18} density={14} drift={0.07} flightRef={flightRef} />
      <NebulaCluster anchor={[14, 9, -72]} color="#4d256b" scale={14} density={11} drift={0.09} flightRef={flightRef} />

      <StarLayer
        count={1150}
        size={0.085}
        opacity={0.38}
        spread={[92, 52]}
        depth={[-24, -190]}
        tint="#f5f8ff"
        rotationSpeed={0.0008}
        flightRef={flightRef}
        travel={260}
      />
      <StarLayer
        count={520}
        size={0.135}
        opacity={0.48}
        spread={[78, 46]}
        depth={[-18, -140]}
        tint="#d7e9ff"
        rotationSpeed={-0.0011}
        flightRef={flightRef}
        travel={220}
      />
      <StarLayer
        count={190}
        size={0.17}
        opacity={0.42}
        spread={[86, 48]}
        depth={[-18, -124]}
        tint="#ffe0c6"
        rotationSpeed={0.0014}
        flightRef={flightRef}
        travel={190}
      />
      <StarLayer
        count={260}
        size={0.05}
        opacity={0.16}
        spread={[52, 30]}
        depth={[-16, -92]}
        tint="#6fd9ff"
        rotationSpeed={-0.002}
        flightRef={flightRef}
        travel={170}
      />

      <WarpLines flightRef={flightRef} />
      <FeatureStars flightRef={flightRef} />
      <SpiralGalaxy flightRef={flightRef} />
      <IcePlanet flightRef={flightRef} />
      <RingedPlanet flightRef={flightRef} />
      <StarClusterNode
        flightRef={flightRef}
        anchor={[-20, 10, -176]}
        color="#e9f5ff"
        radius={6.4}
        count={220}
        revealStart={0.58}
        revealEnd={0.84}
        drift={0.09}
      />
      <StarClusterNode
        flightRef={flightRef}
        anchor={[18, -9, -194]}
        color="#b7d8ff"
        radius={5.8}
        count={190}
        revealStart={0.66}
        revealEnd={0.92}
        drift={0.07}
      />
      <DeepFieldGalaxy
        flightRef={flightRef}
        anchor={[22, 12, -214]}
        start={0.72}
        end={0.96}
        scale={0.76}
        tint="#d8e6ff"
      />
      <DeepFieldGalaxy
        flightRef={flightRef}
        anchor={[-24, -13, -226]}
        start={0.78}
        end={0.99}
        scale={0.62}
        tint="#bfd4ff"
      />
      <BlackHolePhenomenon flightRef={flightRef} />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={0.72}
          luminanceThreshold={0.35}
          luminanceSmoothing={0.95}
          radius={0.82}
        />
        <Noise opacity={0.018} blendFunction={BlendFunction.SOFT_LIGHT} premultiply />
        <Vignette eskil={false} offset={0.2} darkness={0.72} />
      </EffectComposer>
    </>
  )
}

const fallbackBackground =
  'radial-gradient(circle at 18% 20%, rgba(31, 67, 129, 0.22), transparent 32%), radial-gradient(circle at 76% 18%, rgba(72, 35, 118, 0.22), transparent 28%), radial-gradient(circle at 52% 76%, rgba(10, 80, 74, 0.18), transparent 30%), linear-gradient(180deg, #030713 0%, #02050d 45%, #01030a 100%)'

export default function PolishedSpaceBackground() {
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
