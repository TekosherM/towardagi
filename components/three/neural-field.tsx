"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const POINT_COUNT = 1500;
const RADIUS = 2.35;

function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

function buildLinks(positions: Float32Array, count: number): Float32Array {
  const links: number[] = [];
  const step = 5;
  for (let i = 0; i < count; i += step) {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];
    let best = -1;
    let bestDist = Infinity;
    for (let j = 0; j < count; j += 3) {
      if (j === i) continue;
      const dx = positions[j * 3] - ax;
      const dy = positions[j * 3 + 1] - ay;
      const dz = positions[j * 3 + 2] - az;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestDist) {
        bestDist = d;
        best = j;
      }
    }
    if (best >= 0 && bestDist < 0.6) {
      links.push(ax, ay, az, positions[best * 3], positions[best * 3 + 1], positions[best * 3 + 2]);
    }
  }
  return new Float32Array(links);
}

function NeuralFieldScene() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shard = useRef<THREE.Mesh>(null);

  const positions = useMemo(() => fibonacciSphere(POINT_COUNT, RADIUS), []);
  const links = useMemo(() => buildLinks(positions, POINT_COUNT), [positions]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        state.pointer.y * 0.18,
        0.04,
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        state.pointer.x * 0.08,
        0.04,
      );
    }
    if (core.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.06;
      core.current.scale.setScalar(s);
      core.current.rotation.y -= delta * 0.25;
      core.current.rotation.x += delta * 0.1;
    }
    if (shard.current) {
      shard.current.rotation.y += delta * 0.5;
      shard.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <group>
      <group ref={group}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#35f0d0"
            size={0.022}
            sizeAttenuation
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[links, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#1d6f62"
            transparent
            opacity={0.32}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshBasicMaterial color="#9d8cff" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh ref={shard}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#35f0d0" wireframe transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function NeuralField() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#06070a", 7, 12]} />
        <NeuralFieldScene />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
    </div>
  );
}
