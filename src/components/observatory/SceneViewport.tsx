"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** DOM artwork remains underneath if WebGL is unavailable or motion is reduced. */
export default function SceneViewport({
  children,
  className = "",
  camera = [0, 0, 8],
  fov = 42,
  dpr = [1, 1.5],
}: {
  children: ReactNode;
  className?: string;
  camera?: [number, number, number];
  fov?: number;
  /** Device pixel ratio for the canvas; lower renders faster but softer. */
  dpr?: number | [number, number];
}) {
  const container = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [awake, setAwake] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setEnabled(!!gl && !preference.matches);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { rootMargin: "100px" },
    );
    if (container.current) observer.observe(container.current);
    const onVisibility = () => setAwake(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return (
    <div
      ref={container}
      className={`scene-viewport ${className} ${ready && enabled ? "scene-ready" : ""}`}
      aria-hidden="true"
    >
      {enabled && entered && (
        <SceneBoundary
          onFailure={() => {
            setReady(false);
            setEnabled(false);
          }}
        >
          <Canvas
            onCreated={() => setReady(true)}
            camera={{ position: camera, fov }}
            dpr={dpr}
            frameloop={visible && awake ? "always" : "never"}
            // Measure the layout size, not the on-screen size: a CSS scale on
            // a parent (the black hole shrinking into a card) must not shrink
            // the canvas itself, or the picture would be scaled twice.
            resize={{ offsetSize: true }}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            fallback={<span />}
          >
            {children}
          </Canvas>
        </SceneBoundary>
      )}
    </div>
  );
}
