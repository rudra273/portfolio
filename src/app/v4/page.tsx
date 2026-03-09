"use client";

import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Stars, 
  ScrollControls, 
  useScroll, 
  Text, 
  Float, 
  Cloud,
  Html,
  useProgress
} from "@react-three/drei";
import * as THREE from "three";

// --- PROFESSIONAL PALETTE ---
const COLORS = {
  CYAN: "#00d2ff",
  SLATE: "#94a3b8", 
  WHITE: "#ffffff",
  DEEP_BG: "#020617"
};

// --- CONFIGURATION ---
// These are the "stops" along the Z-axis rail
const Z_STOPS = {
  START: 10,
  SECTION_1: 0,
  SECTION_2: -20,
  SECTION_3: -40,
  END: -50
};

// --- LOADER ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="text-cyan-400 font-mono text-sm tracking-widest mb-2">
          SYSTEM INITIALIZATION
        </div>
        <div className="w-64 h-[1px] bg-slate-800">
          <div 
            className="h-full bg-cyan-400 transition-all duration-200" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </Html>
  );
}

// --- BACKGROUND NEBULA ---
// Simplified to be less distracting, more ambient
function AmbientBackground() {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      {/* Distant fog clouds for depth */}
      <Cloud opacity={0.1} speed={0.1} width={50} depth={5} segments={20} position={[0, -10, -50]} color="#0f172a" />
      <Cloud opacity={0.1} speed={0.1} width={50} depth={5} segments={20} position={[0, 10, -80]} color="#1e293b" />
    </group>
  );
}

// --- CINEMATIC CAMERA ---
// This moves the camera strictly on the Z axis based on scroll
function RailCamera() {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    // scroll.offset is a number between 0 and 1
    const offset = scroll.offset;
    
    // Calculate exact Z position
    // We map 0..1 to Z_STOPS.START..Z_STOPS.END
    const targetZ = THREE.MathUtils.lerp(Z_STOPS.START, Z_STOPS.END, offset);
    
    // Smoothly move camera to target (Damping)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    
    // Optional: Very slight banking based on scroll velocity can be added here, 
    // but kept stable for now as requested.
  });
  return null;
}

// --- TEXT UTILITY (FIXED) ---
const Title = ({ children, position, scale = 1, color = COLORS.WHITE, subtitle = false }: any) => {
  return (
    <Text
      position={position}
      scale={scale}
      color={color}
      anchorX="center"
      anchorY="middle"
      // FIXED: Using a public URL instead of local path
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
      fontSize={subtitle ? 0.4 : 1}
      letterSpacing={subtitle ? 0.1 : -0.05}
      maxWidth={12}
      textAlign="center"
    >
      {children}
    </Text>
  );
};

// --- MAIN SCENE CONTENT ---
function PortfolioContent() {
  // We use scroll data to fade items in/out if needed, 
  // but with this layout, physical distance handles most visibility nicely.
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    // Subtle float animation for the whole group effectively
    // We can also fade out the whole group at the very end if desired
  });

  return (
    <group ref={groupRef}>
      
      {/* SECTION 1: HERO (Z = 0) */}
      <group position={[0, 0, Z_STOPS.SECTION_1]}>
        <Title position={[0, 1.5, 0]}>RUDRAPRATAP MOHANTY</Title>
        <Title position={[0, 0.5, 0]} subtitle color={COLORS.CYAN}>AI ENGINEER // ARCHITECT</Title>
        <Title position={[0, -2, 0]} subtitle color={COLORS.SLATE}>
          Scroll to Explore
        </Title>
      </group>

      {/* SECTION 2: SKILLS (Z = -20) */}
      <group position={[0, 0, Z_STOPS.SECTION_2]}>
         {/* Slightly offset to the left for layout variety */}
        <Title position={[-3, 2, 0]} scale={0.8}>CORE ARSENAL</Title>
        
        <group position={[3, 1, 0]}>
           <Title position={[0, 0, 0]} subtitle color={COLORS.CYAN}>PYTHON & PYTORCH</Title>
           <Title position={[0, -0.8, 0]} subtitle color={COLORS.SLATE}>LLM FINE-TUNING</Title>
           <Title position={[0, -1.6, 0]} subtitle color={COLORS.CYAN}>RAG PIPELINES</Title>
           <Title position={[0, -2.4, 0]} subtitle color={COLORS.SLATE}>AWS SAGEMAKER</Title>
        </group>
      </group>

      {/* SECTION 3: PROJECTS (Z = -40) */}
      <group position={[0, 0, Z_STOPS.SECTION_3]}>
        <Title position={[0, 3, 0]} scale={0.8}>SELECTED WORKS</Title>
        
        {/* Project 1 */}
        <group position={[-3, 0.5, 0]}>
          <Title position={[0, 0, 0]} subtitle scale={1.2} color={COLORS.WHITE}>NEURAL VISION</Title>
          <Title position={[0, -0.6, 0]} subtitle scale={0.8} color={COLORS.SLATE}>Real-time Edge Detection</Title>
        </group>

        {/* Project 2 */}
        <group position={[3, -1.5, 0]}>
          <Title position={[0, 0, 0]} subtitle scale={1.2} color={COLORS.WHITE}>SENTIENT AGENTS</Title>
          <Title position={[0, -0.6, 0]} subtitle scale={0.8} color={COLORS.SLATE}>Context-Aware LLMs</Title>
        </group>
      </group>

    </group>
  );
}

// --- APP ENTRY ---
export default function PortfolioFixed() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: COLORS.DEEP_BG }}>
      
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        
        {/* LIGHTING - Cinematic Setup */}
        <color attach="background" args={[COLORS.DEEP_BG]} />
        <fog attach="fog" args={[COLORS.DEEP_BG, 5, 40]} /> {/* Fog hides the pop-in */}
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={COLORS.CYAN} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />

        <Suspense fallback={<Loader />}>
          
          {/* pages={4} determines how long the scroll is.
            damping={0.2} makes the scroll feel heavy and smooth.
          */}
          <ScrollControls pages={4} damping={0.2}>
            
            <AmbientBackground />
            <RailCamera />
            <PortfolioContent />
            
          </ScrollControls>

        </Suspense>
      </Canvas>
      
      {/* UI OVERLAY (Optional) */}
      <div className="absolute top-8 left-8 text-slate-500 font-mono text-xs">
        SYSTEM STATUS: ONLINE
      </div>

    </div>
  );
}