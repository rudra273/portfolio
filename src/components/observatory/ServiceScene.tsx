"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SceneViewport from "./SceneViewport";

const STRANDS = 36;
const SAMPLES = 64;
const COUNT = STRANDS * SAMPLES;
const TAU = Math.PI * 2;

/** One particle identity, four destinations. Every connection survives the morph. */
function createForms() {
  const forms = Array.from({ length: 4 }, () => new Float32Array(COUNT * 3));
  const progress = new Float32Array(COUNT);
  const seeds = new Float32Array(COUNT);
  const indices: number[] = [];
  const corners = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
  const cubeRotation = new THREE.Euler(0.38, 0.6, 0.18);
  const point = new THREE.Vector3();
  // The question mark's spine: hook, then a short stem.
  const question = new THREE.CatmullRomCurve3(
    [
      [-0.72, 0.62],
      [-0.55, 1.08],
      [0, 1.3],
      [0.56, 1.1],
      [0.72, 0.64],
      [0.5, 0.22],
      [0.08, -0.04],
      [0, -0.3],
      [0, -0.55],
    ].map(([x, y]) => new THREE.Vector3(x, y, 0)),
  );
  const spine = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  for (let strand = 0; strand < STRANDS; strand++) {
    const layer = Math.floor(strand / 12);
    const edge = edges[strand % 12];
    for (let sample = 0; sample < SAMPLES; sample++) {
      const i = strand * SAMPLES + sample;
      const u = sample / (SAMPLES - 1);
      progress[i] = u + strand * 0.173;
      seeds[i] = (Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1;

      // A breathing neural globe: twelve meridians on three concentric shells.
      const latitude = (u - 0.5) * Math.PI;
      const longitude =
        ((strand % 12) / 12) * TAU +
        Math.sin(latitude * 2) * 0.38 +
        layer * 0.12;
      const radius = 1.12 + layer * 0.24;
      point
        .set(
          Math.cos(latitude) * Math.cos(longitude),
          Math.sin(latitude),
          Math.cos(latitude) * Math.sin(longitude),
        )
        .multiplyScalar(radius);
      point.toArray(forms[0], i * 3);

      // The very same strands straighten into three nested crystal frameworks.
      const a = corners[edge[0]];
      const b = corners[edge[1]];
      const scale = 0.56 + layer * 0.29;
      point
        .set(
          a[0] + (b[0] - a[0]) * u,
          a[1] + (b[1] - a[1]) * u,
          a[2] + (b[2] - a[2]) * u,
        )
        .multiplyScalar(scale)
        .applyEuler(cubeRotation);
      point.toArray(forms[1], i * 3);

      // A continuous workflow ribbon passes through four processing stages.
      // The crossover lifts in depth, making the loop a physical 3D object.
      if (strand < 24) {
        const quarter = Math.floor(strand / 6);
        const lane = strand % 6;
        const angle = ((quarter + u) * Math.PI) / 2;
        const offset = (lane - 2.5) * 0.035;
        point.set(
          1.75 * Math.cos(angle),
          0.88 * Math.sin(2 * angle) + offset,
          0.3 * Math.sin(angle) + offset,
        );
      } else {
        const stage = Math.floor((strand - 24) / 3);
        const ring = (strand - 24) % 3;
        const angle = Math.PI / 4 + (stage * Math.PI) / 2;
        const r = 0.14;
        const t = u * TAU;
        point.set(
          1.75 * Math.cos(angle) + (ring === 1 ? 0 : r * Math.cos(t)),
          0.88 * Math.sin(2 * angle) + (ring === 2 ? 0 : r * Math.sin(t)),
          0.3 * Math.sin(angle) +
            (ring === 0 ? 0 : r * (ring === 1 ? Math.cos(t) : Math.sin(t))),
        );
      }
      point.toArray(forms[2], i * 3);

      // An open question: 28 strands braid a tube along the curve, and the
      // last 8 wrap the dot beneath it, each ring tilted a little differently.
      if (strand < 28) {
        const phi = (strand / 28) * TAU;
        const tube = 0.07 + (strand % 3) * 0.035;
        question.getPointAt(u, spine);
        question.getTangentAt(u, tangent);
        point.set(
          spine.x - tangent.y * Math.cos(phi) * tube,
          spine.y + tangent.x * Math.cos(phi) * tube,
          Math.sin(phi) * tube,
        );
      } else {
        const ring = strand - 28;
        const a = (ring / 8) * Math.PI;
        const r = 0.08 + (ring % 2) * 0.07;
        const t = u * TAU;
        point.set(
          r * Math.cos(t) * Math.cos(a),
          -1.0 + r * Math.sin(t),
          r * Math.cos(t) * Math.sin(a),
        );
      }
      point.multiplyScalar(1.25).toArray(forms[3], i * 3);
      if (sample < SAMPLES - 1) indices.push(i, i + 1);
    }
  }
  return { forms, progress, seeds, indices: new Uint16Array(indices) };
}

const vertexShader = `
  attribute float aProgress;
  attribute float aSeed;
  uniform float uTime;
  uniform vec4 uWeights;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Subtle idle movement also blends, so no motion changes abruptly on a click.
    float breath = sin(uTime * 0.7 + aProgress * 3.0) * 0.025;
    p *= 1.0 + breath * (uWeights.x + uWeights.w);
    float pulse = pow(0.5 + 0.5 * cos((aProgress - uTime * 0.12) * 6.28318), 18.0);
    vec3 blue = vec3(0.45, 0.76, 1.0);
    vec3 silver = vec3(0.76, 0.89, 1.0);
    vec3 gold = vec3(1.0, 0.72, 0.38);
    vec3 warm = vec3(1.0, 0.86, 0.62);
    vec3 base = blue * uWeights.x + silver * uWeights.y + mix(blue, gold, step(0.35, aSeed)) * uWeights.z + mix(gold, warm, step(0.5, aSeed)) * uWeights.w;
    vColor = mix(base, vec3(0.95, 0.98, 1.0), pulse * 0.7);
    vAlpha = 0.35 + pulse * 0.65;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = clamp((15.0 + pulse * 28.0 + abs(aSeed) * 7.0) / -view.z, 1.5, 10.0);
  }
`;
const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = exp(-d * d * 18.0);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;

function MorphingForm({ mode }: { mode: number }) {
  const group = useRef<THREE.Group>(null);
  const pointsPosition = useRef<THREE.BufferAttribute>(null);
  const linesPosition = useRef<THREE.BufferAttribute>(null);
  const lineMaterial = useRef<THREE.LineBasicMaterial>(null);
  const form = useMemo(createForms, []);
  // Persistent positions AND velocities: interrupted transitions never restart.
  const [positions] = useState(() => new Float32Array(form.forms[mode]));
  const velocities = useMemo(() => new Float32Array(COUNT * 3), []);
  const elapsed = useRef(0);
  // Initial values only: the frame loop eases them toward each new mode.
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uWeights: {
      value: new THREE.Vector4(
        mode === 0 ? 1 : 0,
        mode === 1 ? 1 : 0,
        mode === 2 ? 1 : 0,
        mode === 3 ? 1 : 0,
      ),
    },
  }));
  const lineColors = useMemo(
    () => [
      new THREE.Color("#649fc8"),
      new THREE.Color("#b3d1e5"),
      new THREE.Color("#bbaa88"),
      new THREE.Color("#d9b77e"),
    ],
    [],
  );

  useFrame((state, frameDelta) => {
    // Integrate only visible animation time; returning to the section won't jump.
    const delta = Math.min(frameDelta, 1 / 30);
    elapsed.current += delta;
    const target = form.forms[mode];
    for (let i = 0; i < COUNT; i++) {
      const offset = i * 3;
      // Adjacent particles share timing, keeping each strand smooth in transit.
      const strand = Math.floor(i / SAMPLES);
      const along = (i % SAMPLES) / (SAMPLES - 1);
      const stiffness =
        13 + Math.sin(strand * 0.9) * 1.5 + Math.sin(along * Math.PI) * 0.6;
      const dx = target[offset] - positions[offset];
      const dy = target[offset + 1] - positions[offset + 1];
      const dz = target[offset + 2] - positions[offset + 2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      // A small tangential force gives the journey a curved, liquid quality.
      const curl = Math.min(distance, 1) * 0.85;
      velocities[offset] +=
        (dx * stiffness -
          velocities[offset] * 7 +
          positions[offset + 2] * curl) *
        delta;
      velocities[offset + 1] +=
        (dy * stiffness - velocities[offset + 1] * 7) * delta;
      velocities[offset + 2] +=
        (dz * stiffness -
          velocities[offset + 2] * 7 -
          positions[offset] * curl) *
        delta;
      for (let axis = 0; axis < 3; axis++)
        positions[offset + axis] += velocities[offset + axis] * delta;
    }
    if (pointsPosition.current) pointsPosition.current.needsUpdate = true;
    if (linesPosition.current) linesPosition.current.needsUpdate = true;
    const weights = uniforms.uWeights.value;
    weights.x = THREE.MathUtils.damp(weights.x, mode === 0 ? 1 : 0, 3, delta);
    weights.y = THREE.MathUtils.damp(weights.y, mode === 1 ? 1 : 0, 3, delta);
    weights.z = THREE.MathUtils.damp(weights.z, mode === 2 ? 1 : 0, 3, delta);
    weights.w = THREE.MathUtils.damp(weights.w, mode === 3 ? 1 : 0, 3, delta);
    uniforms.uTime.value = elapsed.current;
    if (lineMaterial.current)
      lineMaterial.current.color.lerp(
        lineColors[mode],
        1 - Math.exp(-3 * delta),
      );
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        mode === 2
          ? Math.sin(elapsed.current * 0.2) * 0.2
          : mode === 3
            ? Math.sin(elapsed.current * 0.35) * 0.45
            : elapsed.current * 0.055,
        2,
        delta,
      );
      group.current.rotation.x = Math.sin(elapsed.current * 0.16) * 0.08;
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        state.pointer.x * 0.035,
        2,
        delta,
      );
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={pointsPosition}
            attach="attributes-position"
            count={COUNT}
            array={positions}
            itemSize={3}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="attributes-aProgress"
            count={COUNT}
            array={form.progress}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aSeed"
            count={COUNT}
            array={form.seeds}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={linesPosition}
            attach="attributes-position"
            count={COUNT}
            array={positions}
            itemSize={3}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="index"
            count={form.indices.length}
            array={form.indices}
            itemSize={1}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterial}
          color="#649fc8"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function ServiceScene({ mode }: { mode: number }) {
  return (
    <SceneViewport camera={[0, 0, 7.8]} fov={42}>
      <MorphingForm mode={mode} />
    </SceneViewport>
  );
}
