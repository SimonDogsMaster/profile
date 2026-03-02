"use client";

import { Float, Html, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import * as THREE from "three";

type FloatingIDEProps = {
  progress: number;
  offset: number;
  reducedMotion: boolean;
};
export function FloatingIDE({ progress, offset, reducedMotion }: FloatingIDEProps) {
  const groupRef = useRef<Group>(null);
  const plateRef = useRef<Group>(null);
  const orbRef = useRef<Group>(null);

  const particlePositions = useMemo(() => {
    const values = new Float32Array(96 * 3);

    for (let index = 0; index < 96; index += 1) {
      const stride = index * 3;
      values[stride] = (Math.random() - 0.5) * 8;
      values[stride + 1] = (Math.random() - 0.5) * 5.4;
      values[stride + 2] = -Math.random() * 5.2;
    }

    return values;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const targetRotationX = reducedMotion ? -0.08 : -0.14 + offset * 0.04;
    const targetRotationY = reducedMotion ? 0.18 : 0.18 - progress * 0.12;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.12 - offset * 0.28, 0.05);

    if (plateRef.current) {
      plateRef.current.rotation.z = THREE.MathUtils.lerp(plateRef.current.rotation.z, -0.16 + progress * 0.05, 0.04);
      plateRef.current.position.x = THREE.MathUtils.lerp(plateRef.current.position.x, 1.4 - progress * 0.2, 0.04);
    }

    if (orbRef.current) {
      orbRef.current.position.y = THREE.MathUtils.lerp(orbRef.current.position.y, 1.24 - offset * 0.08, 0.04);
    }

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.6 - progress * 0.35, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.1 - progress * 0.14, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      <Float speed={reducedMotion ? 0.16 : 0.9} rotationIntensity={reducedMotion ? 0.04 : 0.12} floatIntensity={0.18}>
        <group ref={plateRef} position={[1.4, -1.5, -0.8]} rotation={[0.24, -0.42, -0.16]}>
          <RoundedBox args={[2.6, 1.5, 0.08]} radius={0.14} smoothness={6}>
            <meshPhysicalMaterial
              color="#0b1326"
              metalness={0.18}
              roughness={0.52}
              transparent
              opacity={0.86}
              transmission={0.04}
            />
          </RoundedBox>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[2.2, 1.08]} />
            <meshBasicMaterial color="#10203f" transparent opacity={0.56} />
          </mesh>
        </group>
      </Float>

      <Float speed={reducedMotion ? 0.12 : 0.7} rotationIntensity={reducedMotion ? 0.04 : 0.15} floatIntensity={0.14}>
        <group ref={orbRef} position={[-1.9, 1.24, -1.4]}>
          <mesh>
            <icosahedronGeometry args={[0.32, 1]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#1d4ed8" emissiveIntensity={0.22} roughness={0.32} metalness={0.18} />
          </mesh>
        </group>
      </Float>

      <Float speed={reducedMotion ? 0.12 : 0.8} rotationIntensity={reducedMotion ? 0.04 : 0.12} floatIntensity={0.12}>
        <group position={[-2.05, -1.08, -1.1]} rotation={[0.2, 0.2, 0.3]}>
          <RoundedBox args={[1.15, 0.42, 0.06]} radius={0.12} smoothness={4}>
            <meshPhysicalMaterial color="#0d1831" roughness={0.46} metalness={0.16} transparent opacity={0.78} />
          </RoundedBox>
        </group>
      </Float>

      <Float speed={reducedMotion ? 0.12 : 0.74} rotationIntensity={reducedMotion ? 0.04 : 0.12} floatIntensity={0.12}>
        <group position={[2.04, 0.82, -1.18]} rotation={[-0.14, -0.24, 0.22]}>
          <RoundedBox args={[0.94, 0.38, 0.06]} radius={0.12} smoothness={4}>
            <meshPhysicalMaterial color="#121f3e" roughness={0.44} metalness={0.16} transparent opacity={0.76} />
          </RoundedBox>
        </group>
      </Float>

      <group position={[0, -1.92, -2.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[10, 7.4]} />
          <meshBasicMaterial color="#0a1120" transparent opacity={0.18} />
        </mesh>
      </group>

      <points position={[0, 0, -2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8ad6ff" size={0.03} sizeAttenuation transparent opacity={0.34} />
      </points>

      <Html position={[0, -2.35, -2.1]} transform sprite>
        <div className="pointer-events-none h-20 w-56 rounded-full bg-cyan-300/10 blur-[60px]" />
      </Html>
    </group>
  );
}
