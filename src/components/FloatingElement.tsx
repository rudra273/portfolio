'use client';

import React, { useRef, useEffect } from 'react';

const FloatingElement = ({ children, speed = 0.1 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (elementRef.current) {
        elementRef.current.style.transform = `translateY(${scrollY * speed}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return (
    <div ref={elementRef}>
      {children}
    </div>
  );
};

export default FloatingElement;