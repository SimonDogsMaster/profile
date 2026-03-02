"use client";

import { Float, Html, RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Vector3Tuple } from "three";
import * as THREE from "three";

type FloatingIDEProps = {
  progress: number;
  offset: number;
  reducedMotion: boolean;
  pointer: { x: number; y: number };
};

function WindowDots({ position }: { position: Vector3Tuple }) {
  return (
    <group position={position}>
      {["#ff5f57", "#febc2e", "#28c840"].map((color, index) => (
        <mesh key={color} position={[index * 0.16, 0, 0]}>
          <sphereGeometry args={[0.035, 18, 18]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

export function FloatingIDE({ progress, offset, reducedMotion, pointer }: FloatingIDEProps) {
  const groupRef = useRef<Group>(null);
  const terminalRef = useRef<Group>(null);

  const terminalTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("2D canvas context is not available.");
    }

    ctx.fillStyle = "#08101d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "500 30px Geist Mono, monospace";
    ctx.fillStyle = "#72f1b8";
    ctx.fillText("> npm run build", 40, 82);
    ctx.fillStyle = "#9fb2d1";
    ctx.fillText("Creating an optimized production build...", 40, 144);
    ctx.fillStyle = "#7dd3fc";
    ctx.fillText("Route (app)                              Size", 40, 238);
    ctx.fillStyle = "#d6deeb";
    ctx.fillText("/                                        123 kB", 40, 298);
    ctx.fillStyle = "#72f1b8";
    ctx.fillText("Build completed in 1.8s", 40, 360);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const particlePositions = useMemo(() => {
    const values = new Float32Array(72 * 3);

    for (let index = 0; index < 72; index += 1) {
      const stride = index * 3;
      values[stride] = (Math.random() - 0.5) * 7;
      values[stride + 1] = (Math.random() - 0.5) * 4.5;
      values[stride + 2] = -Math.random() * 4.5;
    }

    return values;
  }, []);

  useEffect(() => {
    return () => {
      terminalTexture.dispose();
    };
  }, [terminalTexture]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const targetRotationX = reducedMotion ? -0.12 : THREE.MathUtils.degToRad(-8 + pointer.y * 8);
    const targetRotationY = reducedMotion ? 0.22 : THREE.MathUtils.degToRad(10 + pointer.x * 12);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.2 - offset * 0.45, 0.05);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pointer.x * 0.18, 0.05);

    if (terminalRef.current) {
      terminalRef.current.rotation.z = THREE.MathUtils.lerp(
        terminalRef.current.rotation.z,
        -0.14 + progress * 0.08,
        0.05
      );
    }

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.8 - progress * 0.45, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2 - progress * 0.25, 0.04);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      <Float speed={reducedMotion ? 0.18 : 1.25} rotationIntensity={0.14} floatIntensity={0.26}>
        <group ref={terminalRef} position={[1.18, -1.42, -0.7]} rotation={[0.16, -0.34, -0.12]}>
          <RoundedBox args={[2.7, 1.5, 0.1]} radius={0.12} smoothness={6}>
            <meshStandardMaterial color="#08101b" metalness={0.16} roughness={0.75} />
          </RoundedBox>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.45, 1.24]} />
            <meshBasicMaterial map={terminalTexture} toneMapped={false} />
          </mesh>
          <Text position={[-0.92, 0.57, 0.07]} fontSize={0.075} color="#89a0c5" anchorX="left">
            terminal
          </Text>
        </group>
      </Float>

      {[
        { label: "Next.js", color: "#7dd3fc", position: [-1.88, 1.18, -1.2] as Vector3Tuple },
        { label: "TypeScript", color: "#60a5fa", position: [1.96, 0.78, -1.1] as Vector3Tuple },
        { label: "Motion", color: "#f9a8d4", position: [-2.02, -1.08, -1.0] as Vector3Tuple }
      ].map((item, index) => (
        <Float key={item.label} speed={0.8 + index * 0.15} rotationIntensity={0.2} floatIntensity={0.32}>
          <group position={item.position}>
            <RoundedBox args={[1.1, 0.38, 0.08]} radius={0.12} smoothness={4}>
              <meshStandardMaterial color="#0d152b" metalness={0.16} roughness={0.82} />
            </RoundedBox>
            <Text position={[0, 0, 0.06]} fontSize={0.11} color={item.color}>
              {item.label}
            </Text>
          </group>
        </Float>
      ))}

      <group position={[0, -1.85, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[9, 7]} />
          <meshBasicMaterial color="#0a1020" transparent opacity={0.2} />
        </mesh>
      </group>

      <points position={[0, 0, -1.8]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8ad6ff" size={0.028} sizeAttenuation transparent opacity={0.42} />
      </points>

      <Html position={[0, -2.35, -2.1]} transform sprite>
        <div className="pointer-events-none h-20 w-56 rounded-full bg-cyan-300/10 blur-[60px]" />
      </Html>
    </group>
  );
}
