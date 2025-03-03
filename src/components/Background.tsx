// // src/components/Background.tsx
'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points } from 'three';
import { Stars } from '@react-three/drei';


function RotatingStars() {
  const starsRef = useRef<Points>(null);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      // Create a swirling effect around the center
      const time = clock.getElapsedTime();
      
      // Rotate around the center (z-axis)
      starsRef.current.rotation.z = time * 0.05;
      
      // Add subtle wobble effect
      starsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      starsRef.current.rotation.y = Math.cos(time * 0.2) * 0.1;

      // Optional: Add some scale pulsing
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      starsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Stars 
      ref={starsRef} 
      radius={200}
      depth={100}
      count={10000}
      factor={6} 
      saturation={0} 
      fade 
      speed={1.5}
    />
  );
}


export default function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 flex justify-center items-center">
      {/* Single Canvas for Stars */}
      <Canvas camera={{ position: [0, 0, 1] }} className="absolute w-full h-full">
        <RotatingStars />
      </Canvas>

      {/* Black Hole GIF with Partial Transparency */}
      <div 
        className="absolute w-[70%] h-[40%] bg-center bg-no-repeat bg-contain opacity-90" 
        style={{ 
          backgroundImage: "url('/blackhole.gif')",
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}


// add commet animation