"use client";

import { Line, Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";

type RibbonData = {
  edgeA: THREE.Vector3[];
  edgeB: THREE.Vector3[];
  geometry: THREE.BufferGeometry;
  particles: Float32Array;
};

function sampleRibbonPoint(t: number) {
  const x = THREE.MathUtils.lerp(-2.5, 2.45, t);
  const y =
    Math.sin(t * Math.PI * 1.35 + 0.18) * 0.82 +
    Math.sin(t * Math.PI * 3.2 + 1.2) * 0.16 -
    0.02;
  const z =
    Math.cos(t * Math.PI * 1.75 + 0.34) * 0.82 +
    Math.sin(t * Math.PI * 2.8) * 0.18;

  return new THREE.Vector3(x, y, z);
}

function buildRibbonGeometry(): RibbonData {
  const segments = 180;
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const edgeA: THREE.Vector3[] = [];
  const edgeB: THREE.Vector3[] = [];

  const up = new THREE.Vector3(0, 0, 1);

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const point = sampleRibbonPoint(t);
    const next = sampleRibbonPoint(Math.min(1, t + 1 / segments));
    const tangent = next.clone().sub(point).normalize();
    const normal = up.clone().cross(tangent).normalize();
    const width =
      0.42 +
      Math.sin(t * Math.PI * 1.6 + 0.4) * 0.12 +
      Math.sin(t * Math.PI * 4.6) * 0.04;
    const twist = Math.sin(t * Math.PI * 2.2 + 0.8) * 0.38;
    const binormal = tangent.clone().cross(normal).normalize();
    const offsetDirection = normal.multiplyScalar(Math.cos(twist)).add(binormal.multiplyScalar(Math.sin(twist))).normalize();
    const left = point.clone().add(offsetDirection.clone().multiplyScalar(width));
    const right = point.clone().add(offsetDirection.clone().multiplyScalar(-width));

    edgeA.push(left.clone());
    edgeB.push(right.clone());

    vertices.push(left.x, left.y, left.z, right.x, right.y, right.z);

    const faceNormal = tangent.clone().cross(offsetDirection).normalize();
    normals.push(
      faceNormal.x,
      faceNormal.y,
      faceNormal.z,
      faceNormal.x,
      faceNormal.y,
      faceNormal.z
    );

    uvs.push(t, 0, t, 1);

    if (index < segments) {
      const stride = index * 2;
      indices.push(stride, stride + 1, stride + 2);
      indices.push(stride + 1, stride + 3, stride + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const particleCount = 3200;
  const particles = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const t = Math.random();
    const point = sampleRibbonPoint(t);
    const next = sampleRibbonPoint(Math.min(1, t + 1 / segments));
    const tangent = next.clone().sub(point).normalize();
    const normal = up.clone().cross(tangent).normalize();
    const width =
      0.42 +
      Math.sin(t * Math.PI * 1.6 + 0.4) * 0.12 +
      Math.sin(t * Math.PI * 4.6) * 0.04;
    const twist = Math.sin(t * Math.PI * 2.2 + 0.8) * 0.38;
    const binormal = tangent.clone().cross(normal).normalize();
    const offsetDirection = normal.multiplyScalar(Math.cos(twist)).add(binormal.multiplyScalar(Math.sin(twist))).normalize();
    const lateral = (Math.random() - 0.5) * 2 * width * 0.94;
    const depthJitter = (Math.random() - 0.5) * 0.03;
    const position = point
      .clone()
      .add(offsetDirection.multiplyScalar(lateral))
      .add(tangent.multiplyScalar(depthJitter));

    particles[index * 3] = position.x;
    particles[index * 3 + 1] = position.y;
    particles[index * 3 + 2] = position.z;
  }

  return { edgeA, edgeB, geometry, particles };
}

export function MotionDNAObject({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<Group>(null);
  const ribbonRef = useRef<Mesh>(null);

  const ribbon = useMemo(() => buildRibbonGeometry(), []);

  useFrame((state) => {
    if (!groupRef.current || !ribbonRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    const targetRotY = reducedMotion ? -0.2 : -0.2 + Math.sin(elapsed * 0.18) * 0.08;
    const targetRotX = reducedMotion ? 0.12 : 0.12 + Math.cos(elapsed * 0.24) * 0.03;
    const targetRotZ = reducedMotion ? -0.08 : -0.08 + Math.sin(elapsed * 0.16) * 0.02;
    const targetY = reducedMotion ? 0.02 : 0.02 + Math.sin(elapsed * 0.32) * 0.04;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);

    ribbonRef.current.rotation.z = THREE.MathUtils.lerp(
      ribbonRef.current.rotation.z,
      reducedMotion ? 0 : Math.sin(elapsed * 0.28) * 0.025,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.02, 0]}>
      <mesh ref={ribbonRef} geometry={ribbon.geometry}>
        <meshPhysicalMaterial
          color="#dbeafe"
          emissive="#60a5fa"
          emissiveIntensity={0.22}
          roughness={0.12}
          metalness={0.1}
          transparent
          opacity={0.92}
          clearcoat={1}
          clearcoatRoughness={0.14}
        />
      </mesh>

      <Line points={ribbon.edgeA} color="#f8fbff" transparent opacity={0.9} lineWidth={1.4} />
      <Line points={ribbon.edgeB} color="#9fe8ff" transparent opacity={0.82} lineWidth={1.2} />

      <Points positions={ribbon.particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#dff4ff"
          size={0.026}
          sizeAttenuation
          depthWrite={false}
          opacity={0.92}
        />
      </Points>

      <mesh position={[0, -1.68, -0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.1, 2.6]} />
        <meshBasicMaterial color="#09111f" transparent opacity={0.12} />
      </mesh>

      <mesh position={[0.14, -1.58, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.34, 72]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.08} />
      </mesh>

      <group position={[0, 0, -1.02]}>
        {[-1.3, 0, 1.3].map((x, index) => (
          <mesh key={index} position={[x, 0, 0]}>
            <planeGeometry args={[0.008, 3.4]} />
            <meshBasicMaterial color="#dbeafe" transparent opacity={0.04} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
