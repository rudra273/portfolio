"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";
import SceneViewport from "./SceneViewport";

const TAU = Math.PI * 2;

function Reflections() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const target = generator.fromScene(room, 0.04);
    scene.environment = target.texture;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);
  return null;
}

// Keep the canvas alive across tab changes; ease each sculpture in and out.
function Sculpture({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!group.current) return;
    const scale = THREE.MathUtils.damp(
      group.current.scale.x,
      active ? 1 : 0.001,
      6,
      Math.min(delta, 0.05),
    );
    group.current.scale.setScalar(scale);
    group.current.visible = scale > 0.015;
  });
  return (
    <group ref={group} scale={0.001}>
      {children}
    </group>
  );
}

function ParticleCore({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.Mesh>(null);
  const links = useRef<THREE.LineBasicMaterial>(null);
  const data = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const anchors: THREE.Vector3[] = [];
    // Deterministic spherical distribution: no flicker or random re-seeding.
    for (let i = 0; i < 900; i++) {
      const y = 1 - (i / 899) * 2;
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const radial = Math.sqrt(1 - y * y);
      const radius = 1.2 + 0.42 * Math.sin(i * 2.39) ** 2;
      const point = new THREE.Vector3(
        Math.cos(angle) * radial,
        y,
        Math.sin(angle) * radial,
      ).multiplyScalar(radius);
      positions.push(point.x, point.y, point.z);
      const c = new THREE.Color(i % 7 === 0 ? "#e9bd7d" : "#92c9f5");
      colors.push(c.r, c.g, c.b);
      if (i % 18 === 0) anchors.push(point);
    }
    const segments: number[] = [];
    anchors.forEach((point, i) => {
      anchors.slice(i + 1).forEach((other) => {
        if (point.distanceTo(other) < 0.85)
          segments.push(...point.toArray(), ...other.toArray());
      });
    });
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      segments: new Float32Array(segments),
    };
  }, []);
  useFrame(({ clock }, delta) => {
    if (!active) return;
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += Math.min(delta, 0.05) * 0.12;
      group.current.rotation.z = Math.sin(t * 0.2) * 0.08;
    }
    if (light.current)
      light.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.09);
    if (links.current)
      links.current.opacity = 0.15 + (Math.sin(t * 0.65) + 1) * 0.15;
  });
  return (
    <group ref={group} rotation={[0.2, 0, 0.1]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={data.positions.length / 3}
            array={data.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={data.colors.length / 3}
            array={data.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`attribute vec3 color; varying vec3 vColor;
            void main() { vColor = color; vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_PointSize = min(12.0, 28.0 / -p.z); }`}
          fragmentShader={`varying vec3 vColor; void main() { float d = length(gl_PointCoord - 0.5); float a = exp(-d*d*20.0); if(d > 0.5) discard; gl_FragColor = vec4(vColor, a); }`}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={data.segments.length / 3}
            array={data.segments}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={links}
          color="#a6cce8"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </lineSegments>
      <mesh ref={light}>
        <icosahedronGeometry args={[0.32, 2]} />
        <meshBasicMaterial color="#e6f5ff" />
        <mesh scale={1.6}>
          <icosahedronGeometry args={[0.32, 1]} />
          <meshBasicMaterial
            color="#80bcf2"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </mesh>
      <mesh position={[0, 0, 0.35]}>
        <planeGeometry args={[2.8, 2.8]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`varying vec2 vUv; void main() { float d = length(vUv - 0.5); float a = exp(-d*d*32.0) * 0.48; gl_FragColor = vec4(0.35, 0.65, 1.0, a); }`}
        />
      </mesh>
      <mesh rotation={[1.1, 0.3, 0.2]}>
        <torusGeometry args={[1.92, 0.006, 6, 160]} />
        <meshBasicMaterial color="#bc9c6c" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

const blocks: [number, number, number][] = [
  [-0.48, -0.48, -0.48],
  [0.48, -0.48, -0.48],
  [-0.48, 0.48, -0.48],
  [0.48, 0.48, -0.48],
  [-0.48, -0.48, 0.48],
  [0.48, -0.48, 0.48],
  [-0.48, 0.48, 0.48],
  [0.48, 0.48, 0.48],
];
function GlassAssembly({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pieces = useRef<(THREE.Group | null)[]>([]);
  const time = useRef(0);
  useEffect(() => {
    if (active) time.current = 0;
  }, [active]);
  const edgeGeometry = useMemo(() => {
    const box = new THREE.BoxGeometry(0.88, 0.88, 0.88);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, []);
  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);
  useFrame((_, delta) => {
    if (!active) return;
    time.current += Math.min(delta, 0.05);
    const t = time.current;
    if (group.current) {
      group.current.rotation.y = 0.65 + Math.sin(t * 0.2) * 0.25;
      group.current.position.y = Math.sin(t * 0.5) * 0.08;
    }
    pieces.current.forEach((piece, i) => {
      if (!piece) return;
      // Assemble on entry, hold, then gently open and close to reveal the pieces.
      const entry = Math.max(0, 1 - Math.max(0, t - i * 0.09) / 2);
      const breathing = t > 4 ? (1 - Math.cos((t - 4) * 0.5)) * 0.12 : 0;
      const spread = 1 + entry * 1.35 + breathing;
      piece.position.set(...blocks[i]).multiplyScalar(spread);
      piece.rotation.set(entry * (i % 2 ? 0.3 : -0.3), entry * 0.3, 0);
    });
  });
  return (
    <group ref={group} rotation={[0.4, 0.65, 0.15]}>
      {blocks.map((position, i) => (
        <group
          key={i}
          ref={(element) => {
            pieces.current[i] = element;
          }}
          position={position}
        >
          <mesh>
            <boxGeometry args={[0.88, 0.88, 0.88]} />
            <meshPhysicalMaterial
              color={i === 3 || i === 4 ? "#d8b77b" : "#9abed7"}
              metalness={0}
              roughness={0.08}
              transmission={0.95}
              transparent
              opacity={0.48}
              depthWrite={false}
              thickness={0.65}
              ior={1.45}
              clearcoat={1}
              envMapIntensity={1.2}
            />
          </mesh>
          <lineSegments geometry={edgeGeometry}>
            <lineBasicMaterial
              color={i === 3 || i === 4 ? "#e3c38e" : "#d1e7f5"}
              transparent
              opacity={0.35}
            />
          </lineSegments>
        </group>
      ))}
      <mesh>
        <octahedronGeometry args={[0.4]} />
        <meshBasicMaterial color="#cae9ff" />
      </mesh>
    </group>
  );
}

function Orbit({ index, active }: { index: number; active: boolean }) {
  const pulse = useRef<THREE.Group>(null);
  const radius = 1.35 + index * 0.3;
  useFrame(({ clock }) => {
    if (!active || !pulse.current) return;
    const angle = clock.elapsedTime * (0.35 + index * 0.08) + index * 2;
    pulse.current.rotation.z = angle;
  });
  const color = index === 1 ? "#efc790" : "#9dd9ff";
  return (
    <group rotation={[0.45 + index * 0.65, index * 0.6, 0.3]}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 6, 144]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * TAU) / 5) * radius,
            Math.sin((i * TAU) / 5) * radius,
            0,
          ]}
        >
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      <group ref={pulse}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(-i * 0.035) * radius,
              Math.sin(-i * 0.035) * radius,
              0,
            ]}
          >
            <sphereGeometry args={[0.045 * (1 - i / 15), 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={1 - i / 12} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function OrbitalNetwork({ active }: { active: boolean }) {
  return (
    <group rotation={[0.15, -0.2, 0.3]}>
      {[0, 1, 2].map((index) => (
        <Orbit key={index} index={index} active={active} />
      ))}
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshPhysicalMaterial
          color="#9dbfd7"
          metalness={0.5}
          roughness={0.2}
          clearcoat={1}
        />
      </mesh>
      <mesh scale={1.2}>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshBasicMaterial
          color="#9dd9ff"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

export default function ServiceScene({ mode }: { mode: number }) {
  return (
    <SceneViewport camera={[0, 0, 7.8]} fov={42}>
      <Reflections />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 5, 4]} intensity={3} color="#d5eaff" />
      <directionalLight position={[4, 0, 2]} intensity={4} color="#e5be88" />
      <Sculpture active={mode === 0}>
        <ParticleCore active={mode === 0} />
      </Sculpture>
      <Sculpture active={mode === 1}>
        <GlassAssembly active={mode === 1} />
      </Sculpture>
      <Sculpture active={mode === 2}>
        <OrbitalNetwork active={mode === 2} />
      </Sculpture>
    </SceneViewport>
  );
}
