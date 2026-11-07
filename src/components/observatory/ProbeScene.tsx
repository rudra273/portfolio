"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";
import SceneViewport from "./SceneViewport";

function StudioReflections() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = null;
      environment.dispose();
    };
  }, [gl, scene]);
  return null;
}
function SolarWing({ side }: { side: number }) {
  return (
    <group position={[side * 1.65, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.65, 0.06, 0.95]} />
        <meshStandardMaterial
          color="#7a674c"
          metalness={0.7}
          roughness={0.38}
        />
      </mesh>
      {Array.from({ length: 6 }, (_, x) =>
        Array.from({ length: 3 }, (_, z) => (
          <mesh
            key={`${x}-${z}`}
            position={[(x - 2.5) * 0.26, 0.038, (z - 1) * 0.29]}
          >
            <boxGeometry args={[0.24, 0.015, 0.27]} />
            <meshPhysicalMaterial
              color="#162b48"
              metalness={0.65}
              roughness={0.2}
              clearcoat={1}
            />
          </mesh>
        )),
      )}
      <mesh position={[-side * 0.95, 0, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.08]} />
        <meshStandardMaterial color="#8d9298" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}
function Probe({ mode }: { mode: number }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const wings = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        -0.45 + state.pointer.x * 0.15 + mode * 0.3,
        2,
        d,
      );
      group.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.45) * 0.07;
      group.current.rotation.z =
        -0.25 + Math.sin(state.clock.elapsedTime * 0.2) * 0.04;
    }
    if (ring.current) {
      ring.current.rotation.y += d * 0.09;
      ring.current.position.y = THREE.MathUtils.damp(
        ring.current.position.y,
        mode === 2 ? 0.6 : 0,
        3,
        d,
      );
    }
    if (core.current)
      core.current.position.y = THREE.MathUtils.damp(
        core.current.position.y,
        mode === 0 ? 0.2 : 0.65,
        3,
        d,
      );
    if (wings.current)
      wings.current.position.y = THREE.MathUtils.damp(
        wings.current.position.y,
        mode === 1 ? -0.4 : 0,
        3,
        d,
      );
  });
  return (
    <group ref={group} rotation={[0.4, -0.45, -0.25]}>
      <mesh>
        <cylinderGeometry args={[0.65, 0.56, 0.7, 8]} />
        <meshStandardMaterial
          color="#aaaeb2"
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.44, 0.35, 0.15, 16]} />
        <meshStandardMaterial
          color="#c5a46d"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
          <mesh position={[0, 0, 0.6]}>
            <boxGeometry args={[0.35, 0.52, 0.04]} />
            <meshStandardMaterial
              color={i % 2 ? "#c1a77a" : "#252c33"}
              metalness={0.65}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, -0.22, 0.63]}>
            <boxGeometry args={[0.27, 0.015, 0.02]} />
            <meshStandardMaterial
              color="#adc9e4"
              emissive="#3b709b"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
      <group ref={core} position={[0, 0.2, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.35, 0.4, 0.25, 32]} />
          <meshStandardMaterial
            color="#cbd0d6"
            metalness={0.65}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.26, 48]} />
          <meshPhysicalMaterial
            color="#89c9fc"
            emissive="#2866a4"
            emissiveIntensity={1.2}
            metalness={0.6}
            roughness={0.05}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.29, 0.025, 8, 48]} />
          <meshStandardMaterial
            color="#d7c29e"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      </group>
      <group ref={wings}>
        <SolarWing side={-1} />
        <SolarWing side={1} />
      </group>
      <group ref={ring} rotation={[0.6, 0, 0.1]}>
        <mesh>
          <torusGeometry args={[1.18, 0.018, 8, 120]} />
          <meshStandardMaterial
            color="#d5c7a9"
            metalness={0.45}
            roughness={0.35}
          />
        </mesh>
        <mesh rotation={[0, 0.5, 0]}>
          <torusGeometry args={[1.25, 0.009, 6, 100]} />
          <meshStandardMaterial
            color="#83aac8"
            emissive="#395d80"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      <mesh position={[0.36, 0.74, -0.2]}>
        <cylinderGeometry args={[0.012, 0.02, 0.9, 8]} />
        <meshStandardMaterial color="#cad4e0" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.36, 1.2, -0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#edce99"
          emissive="#bd6f29"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}
export default function ProbeScene({ mode = 0 }: { mode?: number }) {
  return (
    <SceneViewport camera={[0, 2.8, 6.8]} fov={40}>
      <StudioReflections />
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 5, 3]} intensity={4} color="#dceaff" />
      <directionalLight position={[4, 1, -2]} intensity={5} color="#cfab79" />
      <pointLight position={[0, -2, 2]} intensity={12} color="#5289e3" />
      <Probe mode={mode} />
    </SceneViewport>
  );
}
