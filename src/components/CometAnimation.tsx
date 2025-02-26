'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Define the Comet interface for type safety
interface Comet {
  mesh: THREE.Group;
  trail: THREE.Points;
  initialPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  baseSpeed: number;
  size: number;
  progress: number;
  dir: THREE.Vector3;
  dirLength: number;
  dirNormalized: THREE.Vector3;
  xAxis: THREE.Vector3;
  yAxis: THREE.Vector3;
  initialR: number;
  initialTheta: number;
  angularSpeed: number;
  trailLength: number; // Added to resolve scope issue
}

const CometAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // **Scene Setup**
    const scene = new THREE.Scene();

    // **Camera Setup**
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    // **Renderer Setup**
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // **Center Position (Black Hole)**
    const center = new THREE.Vector3(0, 0, 0);

    // **Comets Array**
    const comets: Comet[] = [];

    // **Create Gradient Texture for Coma**
    const createGradientTexture = (size = 64): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, 'white');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const x = (i / 4) % size;
        const y = Math.floor(i / 4 / size);
        const distance = Math.sqrt((x - size / 2) ** 2 + (y - size / 2) ** 2);
        const alpha = 1 - distance / (size / 2);
        imageData.data[i + 3] = Math.max(0, Math.min(255, alpha * 255));
      }
      ctx.putImageData(imageData, 0, 0);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // **Create Realistic Comet Shape**
    const createRealisticComet = (size: number) => {
      const cometGroup = new THREE.Group();

      // Comet nucleus
      const nucleusGeometry = new THREE.SphereGeometry(0.15 * size, 16, 16);
      const nucleusMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });
      const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
      cometGroup.add(nucleus);

      // Comet coma with gradient texture
      const comaGeometry = new THREE.SphereGeometry(0.3 * size, 16, 16);
      const comaTexture = createGradientTexture();
      const comaMaterial = new THREE.MeshBasicMaterial({
        map: comaTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
      const coma = new THREE.Mesh(comaGeometry, comaMaterial);
      cometGroup.add(coma);

      return cometGroup;
    };

    // **Shaders for Trail**
    const vertexShader = `
      attribute float size;
      attribute float opacity;
      varying float vOpacity;
      void main() {
        gl_PointSize = size;
        vOpacity = opacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 color;
      varying float vOpacity;
      void main() {
        gl_FragColor = vec4(color, vOpacity);
      }
    `;

    // **Create a Single Comet**
    const createComet = (clusterIndex = 0) => {
      const size = 0.1 + Math.random() * 0.3;
      const cometMesh = createRealisticComet(size);

      // Comet trail
      const trailLength = 60;
      const positions = new Float32Array(trailLength * 3);
      const sizes = new Float32Array(trailLength);
      const opacities = new Float32Array(trailLength);
      for (let j = 0; j < trailLength; j++) {
        sizes[j] = 0.08 - (j / (trailLength - 1)) * 0.06;
        opacities[j] = 0.6 - (j / (trailLength - 1)) * 0.4;
      }
      const trailGeometry = new THREE.BufferGeometry();
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      trailGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      trailGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

      const trailMaterial = new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(0xffffff) } },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });

      const trail = new THREE.Points(trailGeometry, trailMaterial);

      // Starting position
      const distance = 40 + Math.random() * 20;
      let theta, phi: number;
      if (clusterIndex > 0) {
        const baseTheta = Math.random() * Math.PI * 2;
        const basePhi = Math.random() * Math.PI - Math.PI / 2;
        theta = baseTheta + (Math.random() * 0.2 - 0.1);
        phi = basePhi + (Math.random() * 0.2 - 0.1);
      } else {
        theta = Math.random() * Math.PI * 2;
        phi = Math.random() * Math.PI - Math.PI / 2;
      }
      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);
      const initialPos = new THREE.Vector3(x, y, z);

      // Target position
      const targetOffset = Math.random() * 1;
      const targetPos = new THREE.Vector3(
        center.x + (Math.random() * 2 - 1) * targetOffset,
        center.y + (Math.random() * 2 - 1) * targetOffset,
        center.z + (Math.random() * 2 - 1) * targetOffset
      );

      // Set initial position
      cometMesh.position.copy(initialPos);
      trail.position.copy(initialPos);

      // Calculate direction and spiral parameters
      const dir = new THREE.Vector3().subVectors(targetPos, initialPos);
      const dirLength = dir.length();
      const dirNormalized = dir.clone().normalize();
      let xAxis: THREE.Vector3;
      if (dirNormalized.x !== 0 || dirNormalized.y !== 0) {
        xAxis = new THREE.Vector3(-dirNormalized.y, dirNormalized.x, 0).normalize();
      } else {
        xAxis = new THREE.Vector3(0, 1, 0).normalize();
      }
      const yAxis = new THREE.Vector3().crossVectors(dirNormalized, xAxis).normalize();
      const initialR = 0.5 + Math.random() * 1.5;
      const initialTheta = Math.random() * Math.PI * 2;
      const angularSpeed = 2 * Math.PI;

      // Add to scene
      scene.add(cometMesh);
      scene.add(trail);

      // Speed
      const baseSpeed = clusterIndex > 0 
        ? 0.003 + Math.random() * 0.002 
        : 0.0025 + Math.random() * 0.005;

      // Add to comets array with trailLength
      comets.push({
        mesh: cometMesh,
        trail,
        initialPos,
        targetPos,
        baseSpeed,
        size,
        progress: 0,
        dir,
        dirLength,
        dirNormalized,
        xAxis,
        yAxis,
        initialR,
        initialTheta,
        angularSpeed,
        trailLength, // Added here
      });
    };

    // **Create a Cluster of Comets**
    const createCometCluster = () => {
      const clusterSize = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < clusterSize; i++) {
        createComet(i + 1);
      }
    };

    // **Spawning Timers**
    let lastSingleCometTime = 0;
    let lastClusterTime = 0;

    // **Initial Comets**
    createComet();
    createCometCluster();

    // **Add Lighting**
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 0);
    scene.add(light);

    // **Animation Loop**
    const animate = (time: number) => {
      // Spawn new comets periodically
      if (time - lastSingleCometTime > 4000 + Math.random() * 4000) {
        createComet();
        lastSingleCometTime = time;
      }
      if (time - lastClusterTime > 10000 + Math.random() * 8000) {
        createCometCluster();
        lastClusterTime = time;
      }

      // Update all comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const comet = comets[i];
        const t = comet.progress;

        // Increase progress
        const progressIncrement = comet.baseSpeed * (1 + (comet.progress * comet.progress * 8));
        comet.progress += progressIncrement;

        // Remove if reached target
        if (comet.progress >= 1) {
          scene.remove(comet.mesh);
          scene.remove(comet.trail);
          comets.splice(i, 1);
          continue;
        }

        // Calculate position using spiral path
        const r = comet.initialR * (1 - t);
        const theta = comet.initialTheta + comet.angularSpeed * t;
        const localX = r * Math.cos(theta);
        const localY = r * Math.sin(theta);
        const localZ = t * comet.dirLength;
        comet.mesh.position.copy(comet.initialPos)
          .addScaledVector(comet.xAxis, localX)
          .addScaledVector(comet.yAxis, localY)
          .addScaledVector(comet.dirNormalized, localZ);

        // Update trail points using comet.trailLength
        const positions = comet.trail.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < comet.trailLength; j++) {
          const trailT = Math.max(0, t - (j * 0.006 * (1 - t)));
          const trailR = comet.initialR * (1 - trailT);
          const trailTheta = comet.initialTheta + comet.angularSpeed * trailT;
          const trailLocalX = trailR * Math.cos(trailTheta);
          const trailLocalY = trailR * Math.sin(trailTheta);
          const trailLocalZ = trailT * comet.dirLength;
          const trailPos = comet.initialPos.clone()
            .addScaledVector(comet.xAxis, trailLocalX)
            .addScaledVector(comet.yAxis, trailLocalY)
            .addScaledVector(comet.dirNormalized, trailLocalZ);
          positions[j * 3] = trailPos.x - comet.mesh.position.x;
          positions[j * 3 + 1] = trailPos.y - comet.mesh.position.y;
          positions[j * 3 + 2] = trailPos.z - comet.mesh.position.z;
        }
        comet.trail.geometry.attributes.position.needsUpdate = true;
        comet.trail.position.copy(comet.mesh.position);

        // Stretch comet as it accelerates
        const stretchFactor = 1 + t * 3;
        comet.mesh.scale.set(comet.size, comet.size, comet.size * stretchFactor);
      }

      // Render scene
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // **Handle Window Resize**
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    requestAnimationFrame(animate);

    // **Cleanup**
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //     if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
  //       containerRef.current.removeChild(renderer.domElement);
  //     }
  //     scene.clear();
  //   };
  // }, []);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

export default CometAnimation;