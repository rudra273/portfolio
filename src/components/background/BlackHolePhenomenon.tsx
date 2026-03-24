import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
type FlightRef = MutableRefObject<{
  progress: number
  target: number
  velocity: number
}>

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

export default function BlackHolePhenomenon({ flightRef }: { flightRef: FlightRef }) {
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
