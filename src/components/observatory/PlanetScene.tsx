"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import SceneViewport from "./SceneViewport";

function Planet() {
  const surface = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/observatory/earth-day.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  const atmosphere = useMemo(
    () => ({
      vertexShader: `varying vec3 vNormal; varying vec3 vPosition;
      void main(){ vNormal=normalize(normalMatrix*normal); vec4 p=modelViewMatrix*vec4(position,1.0); vPosition=p.xyz; gl_Position=projectionMatrix*p; }`,
      fragmentShader: `varying vec3 vNormal; varying vec3 vPosition;
      void main(){ vec3 viewDir=normalize(-vPosition); float rim=pow(1.0-max(dot(vNormal,viewDir),0.0),4.0); gl_FragColor=vec4(vec3(0.19,0.5,1.0),rim*0.72); }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    [],
  );
  useFrame((state, delta) => {
    if (surface.current)
      surface.current.rotation.y += Math.min(delta, 0.05) * 0.012;
    if (group.current) {
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        -0.12 + state.pointer.x * 0.008,
        2,
        delta,
      );
    }
  });
  return (
    <group ref={group} position={[0, -5.05, 0]} rotation={[0, 0, -0.12]}>
      <mesh ref={surface} rotation={[0.1, 2.3, 0.15]}>
        <sphereGeometry args={[4.3, 96, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.92}
          metalness={0.05}
          color="#869db5"
        />
      </mesh>
      <mesh scale={1.006}>
        <sphereGeometry args={[4.3, 80, 48]} />
        <shaderMaterial {...atmosphere} />
      </mesh>
    </group>
  );
}
export default function PlanetScene() {
  return (
    <SceneViewport className="planet-canvas">
      <ambientLight intensity={0.075} />
      <directionalLight position={[-3, 5, 4]} intensity={2.8} color="#b2d0ff" />
      <Suspense fallback={null}>
        <Planet />
      </Suspense>
    </SceneViewport>
  );
}
