// "use client";

// import React, { useRef } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { 
//   Stars, 
//   ScrollControls, 
//   Scroll, 
//   useScroll, 
//   Sparkles, 
//   Float 
// } from "@react-three/drei";
// import * as THREE from "three";

// // --- CONFIGURATION ---
// const SECTION_DISTANCE = 4; // Distance between 3D sections

// // --- 3D COMPONENTS ---

// function BlackHole() {
//   const meshRef = useRef<THREE.Group>(null!);
  
//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.z += delta * 0.2; // Rotate the accretion disk
//     }
//   });

//   return (
//     <group ref={meshRef} position={[0, 0, -15]} scale={2}>
//       {/* The Event Horizon (Black Sphere) */}
//       <mesh>
//         <sphereGeometry args={[1, 32, 32]} />
//         <meshBasicMaterial color="#000000" />
//       </mesh>

//       {/* The Accretion Disk (Glowing Ring) */}
//       <mesh rotation={[1.6, 0, 0]}>
//         <torusGeometry args={[1.6, 0.2, 16, 100]} />
//         <meshStandardMaterial 
//           color="#9333ea" // Purple
//           emissive="#7e22ce" 
//           emissiveIntensity={2} 
//           roughness={0}
//         />
//       </mesh>
      
//       {/* Outer Glow Ring */}
//       <mesh rotation={[1.6, 0, 0]}>
//         <torusGeometry args={[2.2, 0.05, 16, 100]} />
//         <meshStandardMaterial 
//           color="#c084fc" 
//           emissive="#c084fc" 
//           emissiveIntensity={1} 
//         />
//       </mesh>

//       {/* Particle Pull */}
//       <Sparkles count={200} scale={6} size={4} speed={0.4} opacity={0.5} color="#a855f7" />
//     </group>
//   );
// }



// function MovingStars() {
//   const starsRef = useRef<THREE.Group>(null!);
//   useFrame((state, delta) => {
//     // Subtle rotation of the universe
//     starsRef.current.rotation.x -= delta * 0.05;
//     starsRef.current.rotation.y -= delta * 0.05;
//   });
//   return (
//     <group ref={starsRef}>
//       <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
//     </group>
//   );
// }

// // --- CAMERA CONTROLLER ---
// // This binds the scrollbar to the camera movement (The "Zoom" Effect)
// function CameraRig() {
//   const scroll = useScroll();
  
//   useFrame((state) => {
//     // Determine target Z position based on scroll offset
//     // We move from Z: 5 to Z: -10 based on how far user scrolls
//     const targetZ = 5 - (scroll.offset * 20); 
    
//     // Smoothly interpolate camera position
//     state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
    
//     // Slight parallax mouse movement
//     const parallaxX = state.pointer.x * 0.5;
//     const parallaxY = state.pointer.y * 0.5;
//     state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, parallaxX, 0.1);
//     state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, parallaxY, 0.1);
    
//     state.camera.lookAt(0, 0, -20); // Always look towards the black hole
//   });
//   return null;
// }

// // --- HTML CONTENT (The Text) ---

// function HtmlContent() {
//   return (
//     <Scroll html>
//       <div className="w-screen font-sans text-white">
        
//         {/* SECTION 1: HERO */}
//         <section 
//           className="h-screen w-full flex flex-col items-center justify-center p-10 relative"
//           style={{ opacity: 1 }} // You could add opacity logic here based on scroll
//         >
//           <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-purple-500/30 text-center">
//             <h2 className="text-purple-400 text-lg font-mono mb-2 tracking-widest">SYSTEM ONLINE</h2>
//             <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-800">
//               Rudrapratap
//             </h1>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-300 mb-6">Mohanty</h2>
//             <p className="text-xl max-w-lg mx-auto text-gray-400">
//               AI Engineer | Exploring the Event Horizon of Deep Learning
//             </p>
//             <div className="mt-8 text-sm text-gray-500 animate-bounce">
//               Scroll to warp ↓
//             </div>
//           </div>
//         </section>

//         {/* SECTION 2: SKILLS */}
//         <section className="h-screen w-full flex items-center justify-end px-10 md:px-32">
//           <div className="w-full max-w-md bg-black/60 backdrop-blur-md p-8 rounded-xl border-r-4 border-purple-600">
//             <h3 className="text-4xl font-bold mb-6 text-purple-300">Neural Stack</h3>
//             <div className="flex flex-wrap gap-3">
//               {['Python', 'TensorFlow', 'PyTorch', 'Next.js', 'AWS SageMaker', 'LLMs', 'RAG Pipelines'].map((skill) => (
//                 <span key={skill} className="px-3 py-1 bg-purple-900/40 border border-purple-500/50 rounded text-sm text-purple-100">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//             <p className="mt-6 text-gray-300">
//               Specializing in scalable AI architectures and deploying massive models to production environments.
//             </p>
//           </div>
//         </section>

//         {/* SECTION 3: PROJECTS */}
//         <section className="h-screen w-full flex items-center justify-start px-10 md:px-32">
//           <div className="w-full max-w-lg bg-black/60 backdrop-blur-md p-8 rounded-xl border-l-4 border-indigo-600">
//             <h3 className="text-4xl font-bold mb-6 text-indigo-300">Mission Logs</h3>
//             <ul className="space-y-6">
//               <li className="border-b border-gray-700 pb-4">
//                 <h4 className="text-xl font-bold text-white">Project: Neural Vision</h4>
//                 <p className="text-gray-400 text-sm mt-1">Real-time object detection for autonomous robotics using Edge Computing.</p>
//               </li>
//               <li className="border-b border-gray-700 pb-4">
//                 <h4 className="text-xl font-bold text-white">Project: Void Chat</h4>
//                 <p className="text-gray-400 text-sm mt-1">Generative AI assistant capable of contextual memory retention.</p>
//               </li>
//             </ul>
//           </div>
//         </section>

//         {/* SECTION 4: CONTACT / BLACK HOLE ENTRY */}
//         <section className="h-screen w-full flex flex-col items-center justify-center">
//            <div className="text-center">
//              <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
//                Enter the Singularity
//              </h2>
//              <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-purple-400 transition-colors">
//                Contact Me
//              </button>
//            </div>
//         </section>

//       </div>
//     </Scroll>
//   );
// }

// // --- MAIN PAGE ---

// export default function PortfolioV2() {
//   return (
//     <div className="h-screen w-full bg-black">
//       <Canvas>
//         {/* Lighting for the scene */}
//         <ambientLight intensity={0.2} />
//         <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
        
//         {/* ScrollControls manages the virtual scroll area 
//             pages={4} means the total scrollable height is 400vh
//             damping={0.2} adds the smooth "weight" to the scroll
//         */}
//         <ScrollControls pages={4} damping={0.3}>
          
//           {/* 3D Background Elements */}
//           <MovingStars />
//           <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
//             <BlackHole />
//           </Float>
          
//           {/* This component calculates camera position based on scroll */}
//           <CameraRig />

//           {/* HTML Overlay Elements */}
//           <HtmlContent />
          
//         </ScrollControls>
//       </Canvas>
//     </div>
//   );
// }

"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Stars, 
  ScrollControls, 
  Scroll, 
  useScroll, 
  Float 
} from "@react-three/drei";
import * as THREE from "three";

// --- CONFIGURATION ---
const SECTION_DISTANCE = 4;

// --- 3D COMPONENTS ---

function BlackHole() {
  const meshRef = useRef<THREE.Group>(null!);
  const scroll = useScroll();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.15;
      // Subtle pulse based on scroll
      const scale = 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, -15]} scale={2}>
      {/* Event Horizon */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Subtle inner glow */}
      <mesh>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshBasicMaterial 
          color="#6b21a8" 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Accretion Disk */}
      <mesh rotation={[1.5, 0, 0]}>
        <torusGeometry args={[1.8, 0.15, 32, 100]} />
        <meshStandardMaterial 
          color="#a855f7"
          emissive="#8b5cf6" 
          emissiveIntensity={3} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh rotation={[1.5, 0, 0]}>
        <torusGeometry args={[2.3, 0.04, 16, 100]} />
        <meshStandardMaterial 
          color="#c084fc" 
          emissive="#c084fc" 
          emissiveIntensity={2} 
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Far outer subtle ring */}
      <mesh rotation={[1.5, 0, 0]}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#e9d5ff" 
          emissive="#e9d5ff" 
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

function MovingStars() {
  const starsRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    starsRef.current.rotation.x -= delta * 0.02;
    starsRef.current.rotation.y -= delta * 0.03;
  });
  return (
    <group ref={starsRef}>
      <Stars radius={100} depth={80} count={8000} factor={5} saturation={0} fade speed={0.5} />
    </group>
  );
}

// Floating particles around the scene
function CosmicParticles() {
  const particlesRef = useRef<THREE.Points>(null!);
  
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// --- CAMERA CONTROLLER ---
function CameraRig() {
  const scroll = useScroll();
  
  useFrame((state) => {
    const offset = scroll.offset;
    const targetZ = 5 - (offset * 20); 
    
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
    
    const parallaxX = state.pointer.x * 0.5;
    const parallaxY = state.pointer.y * 0.5;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, parallaxX, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, parallaxY, 0.1);
    
    state.camera.lookAt(0, 0, -20);
  });
  return null;
}

// --- HTML CONTENT ---

function HtmlContent() {
  return (
    <Scroll html>
      <div className="w-screen font-sans text-white">
        
        {/* SECTION 1: HERO */}
        <section className="h-screen w-full flex flex-col items-center justify-center p-10 relative">
          <div className="bg-gradient-to-br from-black/60 via-purple-950/30 to-black/60 backdrop-blur-xl p-12 rounded-3xl border border-purple-500/40 text-center shadow-2xl shadow-purple-900/50 hover:border-purple-400/60 transition-all duration-700">
            <div className="mb-4 inline-block px-4 py-1 bg-purple-600/20 rounded-full border border-purple-400/30">
              <h2 className="text-purple-300 text-sm font-mono tracking-[0.3em] animate-pulse">SYSTEM_ONLINE</h2>
            </div>
            <h1 className="text-7xl md:text-9xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-100 to-purple-600 leading-tight" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              Rudrapratap
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-purple-300 mb-8 tracking-wider">Mohanty</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300 leading-relaxed font-light">
              AI Engineer • Deep Learning Architect
            </p>
            <p className="text-base max-w-xl mx-auto text-purple-300/80 mt-3">
              Exploring the Event Horizon of Neural Networks
            </p>
            <div className="mt-12 text-sm text-purple-400/60 animate-bounce font-mono">
              ↓ SCROLL TO ENTER ↓
            </div>
          </div>
        </section>

        {/* SECTION 2: SKILLS */}
        <section className="h-screen w-full flex items-center justify-end px-10 md:px-32">
          <div className="w-full max-w-xl bg-gradient-to-br from-purple-950/50 via-black/70 to-black/50 backdrop-blur-xl p-10 rounded-2xl border-r-4 border-purple-500 shadow-2xl shadow-purple-900/40 hover:shadow-purple-700/60 transition-all duration-700">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-500">Neural Stack</h3>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {['Python', 'TensorFlow', 'PyTorch', 'Next.js', 'AWS SageMaker', 'LLMs', 'RAG', 'Transformers', 'Docker', 'FastAPI'].map((skill) => (
                <span 
                  key={skill} 
                  className="group px-4 py-2 bg-gradient-to-r from-purple-900/60 to-purple-800/40 border border-purple-500/40 rounded-lg text-sm font-medium text-purple-100 hover:from-purple-700/70 hover:to-purple-600/50 hover:border-purple-400/70 hover:-translate-y-1 transition-all duration-300 cursor-default shadow-lg shadow-purple-900/20"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="border-t border-purple-500/20 pt-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                Architecting <span className="text-purple-300 font-semibold">scalable AI systems</span> from research to production. Specialized in deploying <span className="text-purple-300 font-semibold">large language models</span> and building intelligent agents that push the boundaries of what's possible.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROJECTS */}
        <section className="h-screen w-full flex items-center justify-start px-10 md:px-32">
          <div className="w-full max-w-2xl bg-gradient-to-br from-indigo-950/50 via-black/70 to-black/50 backdrop-blur-xl p-10 rounded-2xl border-l-4 border-indigo-500 shadow-2xl shadow-indigo-900/40 hover:shadow-indigo-700/60 transition-all duration-700">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-500">Mission Logs</h3>
            </div>
            
            <div className="space-y-8">
              <div className="group border-l-2 border-indigo-500/30 pl-6 pb-6 hover:border-indigo-400 transition-all duration-300">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1.5 group-hover:bg-indigo-400 transition-colors"></div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">Neural Vision</h4>
                    <div className="inline-block px-2 py-0.5 bg-indigo-900/40 border border-indigo-600/30 rounded text-xs text-indigo-300 mt-2 mb-3">Computer Vision • Edge AI</div>
                    <p className="text-gray-400 leading-relaxed">Real-time object detection system for autonomous robotics. Optimized for edge deployment with <span className="text-indigo-300">sub-50ms latency</span> and 95%+ accuracy on custom datasets.</p>
                  </div>
                </div>
              </div>
              
              <div className="group border-l-2 border-indigo-500/30 pl-6 hover:border-indigo-400 transition-all duration-300">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1.5 group-hover:bg-indigo-400 transition-colors"></div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">Void Chat</h4>
                    <div className="inline-block px-2 py-0.5 bg-indigo-900/40 border border-indigo-600/30 rounded text-xs text-indigo-300 mt-2 mb-3">LLM • RAG • Memory</div>
                    <p className="text-gray-400 leading-relaxed">Context-aware AI assistant powered by advanced RAG pipelines. Features <span className="text-indigo-300">long-term memory retention</span> and multi-modal understanding for complex conversational tasks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CONTACT */}
        <section className="h-screen w-full flex flex-col items-center justify-center px-10">
          <div className="text-center max-w-3xl">
            <div className="mb-6">
              <div className="inline-block w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse mb-6"></div>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-300 to-purple-200 mb-6 leading-tight">
              Enter the Singularity
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
              Ready to build something extraordinary? Let's push the boundaries together.
            </p>
            <button className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-600/50 hover:shadow-purple-500/80">
              <span className="relative z-10">Initiate Contact</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <div className="mt-16 flex justify-center gap-8 text-sm text-gray-500">
              <div className="hover:text-purple-400 transition-colors cursor-pointer">GitHub</div>
              <div className="hover:text-purple-400 transition-colors cursor-pointer">LinkedIn</div>
              <div className="hover:text-purple-400 transition-colors cursor-pointer">Twitter</div>
            </div>
          </div>
        </section>

      </div>
    </Scroll>
  );
}

// --- MAIN PAGE ---

export default function PortfolioV2() {
  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#a855f7" />
        <pointLight position={[-10, -10, 5]} intensity={1} color="#ec4899" />
        
        <ScrollControls pages={4} damping={0.3}>
          <MovingStars />
          <CosmicParticles />
          
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
            <BlackHole />
          </Float>
          
          <CameraRig />
          <HtmlContent />
        </ScrollControls>
      </Canvas>
    </div>
  );
}