"use client";

import { useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import SceneViewport from "./SceneViewport";

/** Starting render resolution: full on desktop, a little under on phones. */
function startDpr() {
  if (typeof window === "undefined") return 1;
  const phone = window.matchMedia(
    "(max-width: 760px), (pointer: coarse)",
  ).matches;
  return phone ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
}

/**
 * A procedural black hole, rendered as one full-screen shader.
 *
 * Each pixel fires a light ray from the camera and steps it through space,
 * bending it toward the hole with the Schwarzschild photon equation
 * (a = -1.5·h²·r̂ / r⁴, units where the event horizon radius is 1).
 * Wherever the bent ray crosses the disk plane it picks up glowing gas, so the
 * far side of the disk appears lensed over and under the shadow, and a thin
 * photon ring forms at its edge. Rays that fall below the horizon stay black;
 * rays that escape sample a warped star field.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = (steps: number) => /* glsl */ `
  precision highp float;
  #define STEPS ${steps}
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uCenter;   // where the hole sits on screen, in screen-height units
  uniform float uZoom;    // camera focal length
  uniform float uTilt;    // extra camera elevation while diving in
  varying vec2 vUv;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float hash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
      mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.07 + 17.3;
      a *= 0.5;
    }
    return v;
  }

  // A quiet, sparse star field: one layer of small steady points. Lensing
  // comes for free because we look stars up with the ray's bent direction.
  vec3 stars(vec3 d) {
    vec3 p = d * 60.0;
    vec3 cell = floor(p);
    vec3 f = fract(p) - 0.5;
    if (hash13(cell) < 0.993) return vec3(0.0);
    vec3 jitter = vec3(hash13(cell + 1.7), hash13(cell + 3.1), hash13(cell + 5.3)) - 0.5;
    float size = mix(0.035, 0.075, hash13(cell + 7.7));
    float s = exp(-dot(f - jitter * 0.5, f - jitter * 0.5) / (size * size));
    vec3 tint = mix(vec3(0.78, 0.85, 1.0), vec3(1.0, 0.9, 0.78), hash13(cell + 9.1));
    return s * tint * mix(0.35, 0.85, hash13(cell + 4.4));
  }

  // Gas clumps orbiting at Keplerian speed: inner gas laps the outer gas.
  float clumps(vec2 ringSeed, float r, float angle, float t) {
    float spin = angle + t * 4.5 / pow(r, 1.5);
    vec2 ring = vec2(cos(spin), sin(spin));
    return fbm(ring * 2.4 + vec2(r * 0.85, r * 0.31) + ringSeed);
  }

  // Thin accretion disk in the y = 0 plane, from just inside the innermost
  // stable orbit (r = 3) out to r = 15. Returns premultiplied colour, opacity.
  vec4 disk(vec3 p, vec3 rayDir) {
    float r = length(p.xz);
    if (r < 2.6 || r > 15.0) return vec4(0.0);
    float angle = atan(p.z, p.x);

    // Differential rotation winds any texture into an ever-tighter spiral.
    // Two copies of the clump field, half a cycle apart, cross-fade so each
    // one is invisible at the moment it resets.
    float period = 26.0;
    float t1 = mod(uTime, period);
    float t2 = mod(uTime + period * 0.5, period);
    float w1 = 1.0 - abs(2.0 * t1 / period - 1.0);
    float c = mix(
      clumps(vec2(31.0, 7.0), r, angle, t2),
      clumps(vec2(0.0), r, angle, t1),
      w1
    );
    float lumps = smoothstep(0.28, 0.72, c);

    // Fine, clean concentric bands, like light through layered silk.
    float bands = 0.86 + 0.14 * sin(r * 7.5 + 1.8 * sin(r * 1.7));

    float profile = smoothstep(2.6, 3.3, r) * pow(smoothstep(15.0, 4.0, r), 1.25);
    float density = profile * bands * (0.45 + 0.75 * lumps);

    // Hotter toward the centre: deep amber → site gold → white-hot.
    float heat = smoothstep(15.0, 2.8, r);
    vec3 col = mix(vec3(0.42, 0.13, 0.03), vec3(1.0, 0.68, 0.32), heat);
    col = mix(col, vec3(1.0, 0.93, 0.80), pow(heat, 5.0));

    // Relativistic beaming: gas moving toward the camera is far brighter.
    vec3 orbit = normalize(vec3(-p.z, 0.0, p.x));
    float beta = clamp(0.62 / sqrt(r), 0.0, 0.55);
    float approach = dot(orbit, -rayDir);
    float boost = pow(max(1.0 + beta * approach * 1.4, 0.05), 3.0);
    col *= boost;
    col = mix(col, col * vec3(0.85, 0.95, 1.2), clamp(approach * beta, 0.0, 1.0));

    float alpha = clamp(density * 1.2, 0.0, 0.96);
    return vec4(col * density * 2.1, alpha);
  }

  void main() {
    vec2 frag = vUv * uResolution;
    vec2 uv = (frag - 0.5 * uResolution) / uResolution.y - uCenter;

    // Camera about 2° above the disk plane (the near edge-on view that gives
    // the halo over the top and the thin arc under), nudged by the pointer.
    float azimuth = -0.35 + uPointer.x * 0.06;
    float elevation = 0.04 + uTilt + uPointer.y * 0.012;
    float dist = 24.0;
    vec3 ro = dist * vec3(cos(elevation) * sin(azimuth), sin(elevation), -cos(elevation) * cos(azimuth));
    vec3 forward = normalize(-ro);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
    vec3 up = cross(forward, right);
    // A slight roll gives the composition a cinematic tilt.
    float roll = -0.06;
    vec3 r2 = right * cos(roll) + up * sin(roll);
    vec3 u2 = up * cos(roll) - right * sin(roll);
    vec3 rd = normalize(forward * uZoom + uv.x * r2 + uv.y * u2);

    vec3 p = ro;
    vec3 v = rd;
    vec3 c = cross(p, v);
    float h2 = dot(c, c);
    vec3 col = vec3(0.0);
    float alpha = 0.0;
    bool captured = false;
    float closest = 1e3;

    for (int i = 0; i < STEPS; i++) {
      float r = length(p);
      closest = min(closest, r);
      // Small steps near the hole, large steps far away. The ray's speed
      // changes as it bends, so divide by it: every step then covers the
      // same distance and can't jump through the horizon.
      float ds = clamp(0.05 * r, 0.02, 1.6);
      float dt = ds / length(v);
      vec3 acc = -1.5 * h2 * p / pow(r, 5.0);
      v += acc * dt;
      vec3 np = p + v * dt;
      if (p.y * np.y < 0.0) {
        vec3 hit = mix(p, np, p.y / (p.y - np.y));
        vec4 d = disk(hit, normalize(v));
        col += (1.0 - alpha) * d.rgb;
        alpha += (1.0 - alpha) * d.a;
      }
      p = np;
      if (dot(p, p) < 1.0) { captured = true; break; }
      if (r > 48.0 && dot(p, v) > 0.0) break;
      if (alpha > 0.985) break;
    }

    if (!captured) col += (1.0 - alpha) * stars(normalize(v));
    // A faint glow hugging the photon sphere (r ≈ 1.5).
    col += vec3(1.0, 0.75, 0.45) * 0.08 * exp(-pow(closest - 1.55, 2.0) * 9.0) * (captured ? 0.0 : 1.0);

    // Filmic tone map, gentle vignette, matching the site's near-black.
    col = 1.0 - exp(-col * 1.35);
    vec2 q = vUv - 0.5;
    col *= 1.0 - dot(q, q) * 0.9;
    col = pow(col, vec3(0.92));
    col += vec3(0.008, 0.012, 0.02);
    // The bloom pass converts linear → screen colour once at the end, so hand
    // it linear values; otherwise blacks lift to grey and the disk washes out.
    gl_FragColor = vec4(pow(col, vec3(2.2)), 1.0);
  }
`;

function Hole({ steps }: { steps: number }) {
  const size = useThree((state) => state.size);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uCenter: { value: new THREE.Vector2(0, -0.27) },
    uZoom: { value: 1.25 },
    uTilt: { value: 0 },
  }));
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader: fragmentShader(steps),
        depthWrite: false,
        depthTest: false,
      }),
    [steps, uniforms],
  );

  useFrame((state, delta) => {
    const dpr = state.gl.getPixelRatio();
    uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
    uniforms.uTime.value += Math.min(delta, 1 / 20);
    const pointer = uniforms.uPointer.value;
    pointer.x = THREE.MathUtils.damp(pointer.x, state.pointer.x, 1.5, delta);
    pointer.y = THREE.MathUtils.damp(pointer.y, state.pointer.y, 1.5, delta);
    // Phones are portrait: pull the camera back so the disk still fits.
    const portrait = size.width < size.height;
    const zoom = portrait ? 0.62 : 1.15;
    const centerY = portrait ? -0.22 : -0.27;

    // Dive: while the hero is pinned, scrolling flies the camera into the
    // disk. The hole slides aside and grows until the disk's bright strands
    // sweep across the whole screen, handing over to the gold lines below.
    const hero = document.getElementById("top");
    let dive = 0;
    if (hero) {
      const travel = hero.offsetHeight - window.innerHeight;
      if (travel > 0)
        dive = THREE.MathUtils.clamp(
          -hero.getBoundingClientRect().top / travel,
          0,
          1,
        );
    }
    const e = dive * dive * (3 - 2 * dive);
    const zoomEnd = zoom * 3;
    uniforms.uZoom.value = THREE.MathUtils.lerp(zoom, zoomEnd, e);
    // Aim at the disk about 7 units left of the hole (0.29 = 7 / 24 distance).
    uniforms.uCenter.value.x = 0.29 * uniforms.uZoom.value * e;
    uniforms.uCenter.value.y = THREE.MathUtils.lerp(centerY, 0, e);
    uniforms.uTilt.value = 0.015 * e;
  });

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

/** Lowers resolution, then step count, if the device can't hold the frame rate. */
function AdaptiveHole() {
  const setDpr = useThree((state) => state.setDpr);
  const [mobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 760px), (pointer: coarse)").matches,
  );
  const [scale, setScale] = useState(startDpr);
  const [steps, setSteps] = useState(mobile ? 150 : 220);
  useEffect(() => setDpr(scale), [scale, setDpr]);
  return (
    <PerformanceMonitor
      onDecline={() => {
        if (scale > 0.6) setScale(Math.max(scale - 0.15, 0.5));
        else if (steps > 140) setSteps(140);
      }}
    >
      <Hole steps={steps} />
      {/* A soft glow around the brightest gas: the polished, filmic finish. */}
      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={0.6}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.35}
          radius={0.7}
        />
      </EffectComposer>
    </PerformanceMonitor>
  );
}

export default function BlackHoleScene() {
  const [dpr] = useState(startDpr);
  return (
    <SceneViewport className="blackhole-canvas" camera={[0, 0, 1]} dpr={dpr}>
      <AdaptiveHole />
    </SceneViewport>
  );
}
