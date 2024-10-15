'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars({ count = 5000 }) {
  const points = useRef();
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    points.current.rotation.x -= delta / 10;
    points.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function Nebula() {
  const mesh = useRef();
  const texture = useMemo(() => new THREE.TextureLoader().load('/nebula.png'), []);

  useFrame((state) => {
    mesh.current.material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={mesh} scale={[10, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        uniforms={{
          uTexture: { value: texture },
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv;
            uv.y += sin(uv.x * 10.0 + uTime * 0.1) * 0.01;
            vec4 color = texture2D(uTexture, uv);
            gl_FragColor = color;
          }
        `}
      />
    </mesh>
  );
}

export default function SpaceBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#000010']} />
        <Stars />
        <Nebula />
      </Canvas>
    </div>
  );
}