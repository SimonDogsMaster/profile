"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh, Points } from "three";
import * as THREE from "three";

type SceneProps = {
  activeSection: string;
  pointer: { x: number; y: number };
  reducedMotion: boolean;
  sectionProgress: number;
  scrollProgress: number;
};

const sectionTargets: Record<
  string,
  {
    cameraY: number;
    cameraZ: number;
    particleScale: number;
    particleY: number;
    panelSpread: number;
    panelTilt: number;
    nodeY: number;
    glowOpacity: number;
  }
> = {
  hero: { cameraY: 0.12, cameraZ: 7, particleScale: 1.1, particleY: 0.2, panelSpread: 1.2, panelTilt: 0.22, nodeY: 0.12, glowOpacity: 0.2 },
  availability: { cameraY: 0.04, cameraZ: 7.2, particleScale: 0.98, particleY: 0.06, panelSpread: 1.04, panelTilt: 0.16, nodeY: 0.04, glowOpacity: 0.16 },
  about: { cameraY: -0.02, cameraZ: 7.3, particleScale: 0.92, particleY: -0.08, panelSpread: 0.92, panelTilt: 0.12, nodeY: -0.02, glowOpacity: 0.13 },
  "motion-dna": { cameraY: 0, cameraZ: 7.1, particleScale: 1.02, particleY: 0.02, panelSpread: 1.12, panelTilt: 0.18, nodeY: 0.08, glowOpacity: 0.19 },
  skills: { cameraY: -0.08, cameraZ: 6.9, particleScale: 1.08, particleY: -0.12, panelSpread: 1.18, panelTilt: 0.2, nodeY: 0.18, glowOpacity: 0.18 },
  process: { cameraY: -0.04, cameraZ: 7.15, particleScale: 0.94, particleY: -0.06, panelSpread: 0.98, panelTilt: 0.14, nodeY: 0.02, glowOpacity: 0.14 },
  projects: { cameraY: 0.08, cameraZ: 6.95, particleScale: 1.04, particleY: 0.1, panelSpread: 1.26, panelTilt: 0.24, nodeY: 0.16, glowOpacity: 0.2 },
  timeline: { cameraY: -0.1, cameraZ: 7.25, particleScale: 0.9, particleY: -0.16, panelSpread: 0.88, panelTilt: 0.1, nodeY: -0.04, glowOpacity: 0.12 },
  contact: { cameraY: -0.16, cameraZ: 7.35, particleScale: 0.82, particleY: -0.2, panelSpread: 0.8, panelTilt: 0.06, nodeY: -0.08, glowOpacity: 0.1 }
};

function createParticlePositions() {
  const count = 240;
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    values[stride] = (Math.random() - 0.5) * 9;
    values[stride + 1] = (Math.random() - 0.5) * 5.8;
    values[stride + 2] = (Math.random() - 0.5) * 3.2;
  }

  return values;
}

function InterfaceBars({
  bars
}: {
  bars: Array<{ position: [number, number, number]; size: [number, number]; opacity?: number }>;
}) {
  return (
    <group>
      {bars.map((bar, index) => (
        <mesh key={index} position={bar.position}>
          <planeGeometry args={bar.size} />
          <meshBasicMaterial color="#dbeafe" transparent opacity={bar.opacity ?? 0.16} />
        </mesh>
      ))}
    </group>
  );
}

function InterfacePlane({
  bars,
  headerWidth,
  position,
  rotation,
  size,
  tint
}: {
  bars: Array<{ position: [number, number, number]; size: [number, number]; opacity?: number }>;
  headerWidth: number;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number];
  tint: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={size} radius={0.09} smoothness={5}>
        <meshPhysicalMaterial color="#0c1630" transparent opacity={0.26} roughness={0.4} metalness={0.12} />
      </RoundedBox>

      <mesh position={[0, 0, size[2] * 0.52]}>
        <planeGeometry args={[size[0] * 0.92, size[1] * 0.84]} />
        <meshBasicMaterial color="#07102a" transparent opacity={0.48} />
      </mesh>

      <mesh position={[0, size[1] * 0.26, size[2] * 0.55]}>
        <planeGeometry args={[size[0] * 0.92, size[1] * 0.16]} />
        <meshBasicMaterial color="#102047" transparent opacity={0.62} />
      </mesh>

      <mesh position={[-size[0] * 0.22, size[1] * 0.26, size[2] * 0.56]}>
        <planeGeometry args={[headerWidth, size[1] * 0.08]} />
        <meshBasicMaterial color={tint} transparent opacity={0.2} />
      </mesh>

      <mesh position={[0, 0, size[2] * 0.58]}>
        <planeGeometry args={[size[0] * 0.94, size[1] * 0.88]} />
        <meshBasicMaterial color={tint} transparent opacity={0.045} />
      </mesh>

      <mesh position={[0, 0, -size[2] * 0.54]}>
        <planeGeometry args={[size[0] * 0.9, size[1] * 0.74]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.04} />
      </mesh>

      <InterfaceBars bars={bars} />
    </group>
  );
}

export function WorldScene({
  activeSection,
  pointer,
  reducedMotion,
  sectionProgress,
  scrollProgress
}: SceneProps) {
  const particleGroupRef = useRef<Group>(null);
  const planeARef = useRef<Group>(null);
  const planeBRef = useRef<Group>(null);
  const planeCRef = useRef<Group>(null);
  const nodeGroupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const pointCloudRef = useRef<Points>(null);

  const particlePositions = useMemo(() => createParticlePositions(), []);

  useFrame((state) => {
    const target = sectionTargets[activeSection] ?? sectionTargets.hero;
    const time = state.clock.getElapsedTime();

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      reducedMotion ? 0 : pointer.x * 0.18,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      target.cameraY + (reducedMotion ? 0 : pointer.y * -0.08),
      0.05
    );
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, target.cameraZ, 0.05);
    state.camera.lookAt(0, 0, 0);

    if (particleGroupRef.current) {
      particleGroupRef.current.position.y = THREE.MathUtils.lerp(particleGroupRef.current.position.y, target.particleY, 0.05);
      const scale = THREE.MathUtils.lerp(particleGroupRef.current.scale.x, target.particleScale, 0.05);
      particleGroupRef.current.scale.setScalar(scale);
      particleGroupRef.current.rotation.y += reducedMotion ? 0 : 0.0008;
      particleGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        particleGroupRef.current.rotation.x,
        reducedMotion ? 0 : pointer.y * -0.04,
        0.04
      );
    }

    if (planeARef.current) {
      planeARef.current.position.x = THREE.MathUtils.lerp(planeARef.current.position.x, -1.6 * target.panelSpread, 0.05);
      planeARef.current.rotation.z = THREE.MathUtils.lerp(planeARef.current.rotation.z, -target.panelTilt, 0.05);
    }
    if (planeBRef.current) {
      planeBRef.current.position.x = THREE.MathUtils.lerp(planeBRef.current.position.x, 0.2, 0.05);
      planeBRef.current.position.y = THREE.MathUtils.lerp(planeBRef.current.position.y, 0.26 + target.panelSpread * 0.08, 0.05);
      planeBRef.current.rotation.z = THREE.MathUtils.lerp(planeBRef.current.rotation.z, 0.04, 0.05);
    }
    if (planeCRef.current) {
      planeCRef.current.position.x = THREE.MathUtils.lerp(planeCRef.current.position.x, 1.7 * target.panelSpread, 0.05);
      planeCRef.current.rotation.z = THREE.MathUtils.lerp(planeCRef.current.rotation.z, target.panelTilt, 0.05);
    }

    if (nodeGroupRef.current) {
      nodeGroupRef.current.position.y = THREE.MathUtils.lerp(nodeGroupRef.current.position.y, target.nodeY, 0.05);
      nodeGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        nodeGroupRef.current.rotation.z,
        reducedMotion ? 0 : Math.sin(time * 0.22) * 0.04,
        0.04
      );
    }

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(material.opacity, target.glowOpacity + sectionProgress * 0.03, 0.06);
    }

    if (pointCloudRef.current) {
      pointCloudRef.current.rotation.z = scrollProgress * 0.5;
    }
  });

  return (
    <group>
      <group ref={particleGroupRef} position={[0, 0.2, -0.8]}>
        <points ref={pointCloudRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#8ad6ff" size={0.032} sizeAttenuation transparent opacity={0.2} depthWrite={false} />
        </points>
      </group>

      <Float speed={reducedMotion ? 0.1 : 0.5} rotationIntensity={reducedMotion ? 0.02 : 0.04} floatIntensity={0.08}>
        <group ref={planeARef}>
          <InterfacePlane
            position={[-1.6, 0.4, -0.6]}
            rotation={[0.2, -0.38, -0.22]}
            size={[1.65, 1.04, 0.06]}
            headerWidth={0.42}
            tint="#67e8f9"
            bars={[
              { position: [-0.28, 0.22, 0.042], size: [0.18, 0.045], opacity: 0.26 },
              { position: [-0.08, 0.22, 0.042], size: [0.12, 0.045], opacity: 0.18 },
              { position: [-0.12, 0.05, 0.042], size: [0.52, 0.065], opacity: 0.18 },
              { position: [-0.04, -0.08, 0.042], size: [0.66, 0.08], opacity: 0.13 },
              { position: [-0.18, -0.25, 0.042], size: [0.4, 0.06], opacity: 0.16 }
            ]}
          />
        </group>
      </Float>

      <Float speed={reducedMotion ? 0.1 : 0.42} rotationIntensity={reducedMotion ? 0.02 : 0.04} floatIntensity={0.06}>
        <group ref={planeBRef}>
          <InterfacePlane
            position={[0.2, 0.36, -0.4]}
            rotation={[-0.08, 0.12, 0.04]}
            size={[2.1, 1.3, 0.06]}
            headerWidth={0.52}
            tint="#dbeafe"
            bars={[
              { position: [-0.56, 0.28, 0.042], size: [0.24, 0.048], opacity: 0.22 },
              { position: [-0.3, 0.28, 0.042], size: [0.18, 0.048], opacity: 0.16 },
              { position: [-0.5, 0.02, 0.042], size: [0.74, 0.085], opacity: 0.15 },
              { position: [0.28, 0.02, 0.042], size: [0.56, 0.18], opacity: 0.12 },
              { position: [-0.48, -0.22, 0.042], size: [0.62, 0.07], opacity: 0.14 },
              { position: [0.24, -0.22, 0.042], size: [0.44, 0.07], opacity: 0.18 }
            ]}
          />
        </group>
      </Float>

      <Float speed={reducedMotion ? 0.1 : 0.54} rotationIntensity={reducedMotion ? 0.02 : 0.04} floatIntensity={0.08}>
        <group ref={planeCRef}>
          <InterfacePlane
            position={[1.7, -0.48, -0.8]}
            rotation={[-0.18, 0.32, 0.22]}
            size={[1.52, 0.88, 0.06]}
            headerWidth={0.34}
            tint="#93c5fd"
            bars={[
              { position: [-0.2, 0.18, 0.042], size: [0.26, 0.046], opacity: 0.2 },
              { position: [0.08, 0.18, 0.042], size: [0.18, 0.046], opacity: 0.14 },
              { position: [-0.1, -0.02, 0.042], size: [0.54, 0.11], opacity: 0.13 },
              { position: [0.04, -0.22, 0.042], size: [0.62, 0.07], opacity: 0.17 }
            ]}
          />
        </group>
      </Float>

      <group ref={nodeGroupRef} position={[0, 0.12, 0]}>
        {[
          [-1.8, 0.92, -0.2],
          [-0.58, 0.18, 0],
          [0.52, -0.16, 0.12],
          [1.64, 0.44, -0.12]
        ].map((position, index) => (
          <group key={index} position={position as [number, number, number]}>
            <mesh>
              <sphereGeometry args={[0.05, 20, 20]} />
              <meshStandardMaterial color="#e7f7ff" emissive="#67e8f9" emissiveIntensity={0.14} roughness={0.34} />
            </mesh>
            <mesh scale={1.9}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#a5f3fc" transparent opacity={0.05} depthWrite={false} />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[0, 0.02, -1.2]}>
        {[-2.2, -0.8, 0.8, 2.2].map((x, index) => (
          <mesh key={index} position={[x, 0, 0]}>
            <planeGeometry args={[0.01, 6.4]} />
            <meshBasicMaterial color="#dbeafe" transparent opacity={0.04} />
          </mesh>
        ))}
        {[-2.1, -0.7, 0.7, 2.1].map((y, index) => (
          <mesh key={index} position={[0, y, 0]}>
            <planeGeometry args={[9.4, 0.01]} />
            <meshBasicMaterial color="#dbeafe" transparent opacity={0.035} />
          </mesh>
        ))}
      </group>

      <mesh ref={glowRef} position={[0, -1.8, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.8, 4.6]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.14} />
      </mesh>
    </group>
  );
}
