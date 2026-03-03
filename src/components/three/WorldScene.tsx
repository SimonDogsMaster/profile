"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group, LineSegments, Points, Texture } from "three";
import * as THREE from "three";

type SceneProps = {
  activeSection: string;
  pointer: { x: number; y: number };
  reducedMotion: boolean;
  sectionProgress: number;
  scrollProgress: number;
  scrollVelocity: number;
};

const sectionTargets: Record<
  string,
  {
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    coreX: number;
    coreY: number;
    coreScale: number;
    coreOpacity: number;
  }
> = {
  hero: { cameraX: 0.04, cameraY: 0.12, cameraZ: 9.6, coreX: 0.68, coreY: 0.08, coreScale: 0.92, coreOpacity: 0.3 },
  availability: { cameraX: 0.04, cameraY: 0.08, cameraZ: 9.15, coreX: 0.68, coreY: 0.08, coreScale: 0.96, coreOpacity: 0.3 },
  about: { cameraX: 0.04, cameraY: 0.04, cameraZ: 8.7, coreX: 0.68, coreY: 0.07, coreScale: 1, coreOpacity: 0.32 },
  "motion-dna": { cameraX: 0.04, cameraY: 0.03, cameraZ: 8.25, coreX: 0.68, coreY: 0.07, coreScale: 1.04, coreOpacity: 0.32 },
  skills: { cameraX: 0.04, cameraY: 0.01, cameraZ: 7.8, coreX: 0.68, coreY: 0.06, coreScale: 1.08, coreOpacity: 0.34 },
  process: { cameraX: 0.04, cameraY: 0, cameraZ: 7.35, coreX: 0.68, coreY: 0.06, coreScale: 1.14, coreOpacity: 0.36 },
  projects: { cameraX: 0.04, cameraY: 0.01, cameraZ: 6.9, coreX: 0.68, coreY: 0.05, coreScale: 1.2, coreOpacity: 0.38 },
  timeline: { cameraX: 0.04, cameraY: -0.01, cameraZ: 6.45, coreX: 0.68, coreY: 0.05, coreScale: 1.26, coreOpacity: 0.4 },
  contact: { cameraX: 0.04, cameraY: -0.03, cameraZ: 6.15, coreX: 0.68, coreY: 0.04, coreScale: 1.22, coreOpacity: 0.36 }
};

const TUNNEL_DEPTH = 180;

function randomTunnelPoint(radius: number, depth: number) {
  const angle = Math.random() * Math.PI * 2;
  const ring = Math.pow(Math.random(), 0.62) * radius;
  return {
    x: Math.cos(angle) * ring,
    y: Math.sin(angle) * ring * 0.6,
    z: -Math.random() * depth
  };
}

function createTunnelPositions(count: number, radius: number, depth: number) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const point = randomTunnelPoint(radius, depth);
    const stride = index * 3;
    values[stride] = point.x;
    values[stride + 1] = point.y;
    values[stride + 2] = point.z;
  }

  return values;
}

function createGalaxyCore(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const core = new THREE.Color("#fff6f2");
  const warm = new THREE.Color("#f7b4cf");
  const cool = new THREE.Color("#7b7fff");

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const arm = index % 4;
    const radius = Math.pow(Math.random(), 0.8) * 17;
    const armAngle = arm * (Math.PI / 2);
    const twist = radius * 0.88;
    const armSpread = 0.08 + radius * 0.008;
    const angle = armAngle + twist + (Math.random() - 0.5) * armSpread;
    const warp = 1 + radius * 0.018;
    const x = Math.cos(angle) * radius * 1.4 * warp;
    const y = Math.sin(angle) * radius * 0.4;
    const z = -72 + (Math.random() - 0.5) * (3.2 + radius * 0.08);

    positions[stride] = x;
    positions[stride + 1] = y;
    positions[stride + 2] = z;

    const radialMix = Math.min(1, radius / 17);
    const color = core
      .clone()
      .lerp(warm, radialMix * 0.66)
      .lerp(cool, Math.max(0, radialMix - 0.18) * 1.04);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  return { positions, colors };
}

function createCoreDust(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = Math.pow(Math.random(), 1.2) * 7.5;
    const angle = Math.random() * Math.PI * 2;

    positions[stride] = Math.cos(angle) * radius;
    positions[stride + 1] = Math.sin(angle) * radius * 0.42;
    positions[stride + 2] = -71 + (Math.random() - 0.5) * 2.5;
  }

  return positions;
}

function createHaloCloud(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = 4 + Math.random() * 15;
    const angle = Math.random() * Math.PI * 2;

    positions[stride] = Math.cos(angle) * radius * 1.45;
    positions[stride + 1] = Math.sin(angle) * radius * 0.68;
    positions[stride + 2] = -72 + (Math.random() - 0.5) * 6.5;
  }

  return positions;
}

function createInnerCoreGlow(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = Math.pow(Math.random(), 1.9) * 3.2;
    const angle = Math.random() * Math.PI * 2;

    positions[stride] = Math.cos(angle) * radius * 1.08;
    positions[stride + 1] = Math.sin(angle) * radius * 0.32;
    positions[stride + 2] = -71.4 + (Math.random() - 0.5) * 1.3;
  }

  return positions;
}

function createCoreFalloff(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = 1.8 + Math.pow(Math.random(), 0.8) * 10.5;
    const angle = Math.random() * Math.PI * 2;

    positions[stride] = Math.cos(angle) * radius * 1.26;
    positions[stride + 1] = Math.sin(angle) * radius * 0.42;
    positions[stride + 2] = -71.8 + (Math.random() - 0.5) * 2.8;
  }

  return positions;
}

function createDustHaze(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const arm = index % 4;
    const radius = 4 + Math.pow(Math.random(), 0.7) * 19;
    const armAngle = arm * (Math.PI / 2);
    const twist = radius * 0.83;
    const angle = armAngle + twist + (Math.random() - 0.5) * (0.3 + radius * 0.018);
    const spread = 0.8 + radius * 0.035;
    const offset = (Math.random() - 0.5) * spread;

    positions[stride] = Math.cos(angle) * radius * 1.52 + Math.cos(angle + Math.PI / 2) * offset;
    positions[stride + 1] =
      Math.sin(angle) * radius * 0.36 + Math.sin(angle + Math.PI / 2) * offset * 0.24;
    positions[stride + 2] = -72 + (Math.random() - 0.5) * 2.6;
  }

  return positions;
}

function createPinkClusters(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const arm = index % 4;
    const radius = 6 + Math.pow(Math.random(), 0.62) * 16;
    const armAngle = arm * (Math.PI / 2);
    const twist = radius * 0.87;
    const angle = armAngle + twist + (Math.random() - 0.5) * 0.08;
    const clusterTightness = 0.18 + Math.random() * 0.18;
    const offset = (Math.random() - 0.5) * clusterTightness;

    positions[stride] = Math.cos(angle) * radius * 1.56 + Math.cos(angle + Math.PI / 2) * offset;
    positions[stride + 1] =
      Math.sin(angle) * radius * 0.34 + Math.sin(angle + Math.PI / 2) * offset * 0.18;
    positions[stride + 2] = -71.7 + (Math.random() - 0.5) * 0.9;
  }

  return positions;
}

function createSpiralArcs(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const arm = index % 3;
    const radius = 3 + Math.random() * 18;
    const angle = arm * ((Math.PI * 2) / 3) + radius * 0.78 + (Math.random() - 0.5) * 0.07;

    positions[stride] = Math.cos(angle) * radius * 1.62;
    positions[stride + 1] = Math.sin(angle) * radius * 0.28;
    positions[stride + 2] = -72 + (Math.random() - 0.5) * 1.6;
  }

  return positions;
}

function createPointSprite() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.28, "rgba(255,255,255,0.96)");
  gradient.addColorStop(0.68, "rgba(255,255,255,0.22)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function resetTunnelStar(
  values: Float32Array,
  stride: number,
  radius: number,
  depth: number,
  zOffset = 12
) {
  const point = randomTunnelPoint(radius, depth);
  values[stride] = point.x;
  values[stride + 1] = point.y;
  values[stride + 2] = -depth - Math.random() * zOffset;
}

function updateTunnel(
  ref: RefObject<Points | null>,
  radius: number,
  depth: number,
  speed: number,
  delta: number,
  exitZ = 18
) {
  if (!ref.current || speed <= 0.0001) {
    return;
  }

  const positionAttribute = ref.current.geometry.attributes.position as THREE.BufferAttribute;
  const values = positionAttribute.array as Float32Array;

  for (let index = 0; index < values.length; index += 3) {
    values[index + 2] += speed * delta * 18;

    if (values[index + 2] > exitZ) {
      resetTunnelStar(values, index, radius, depth);
    }
  }

  positionAttribute.needsUpdate = true;
}

function tuneTunnelMaterial(
  ref: RefObject<Points | null>,
  opacity: number,
  size: number
) {
  if (!ref.current) {
    return;
  }

  const material = ref.current.material as THREE.PointsMaterial;
  material.opacity = THREE.MathUtils.lerp(material.opacity, opacity, 0.08);
  material.size = THREE.MathUtils.lerp(material.size, size, 0.08);
}

function createStreakSegments(count: number, radius: number, depth: number) {
  const positions = new Float32Array(count * 6);

  for (let index = 0; index < count; index += 1) {
    const point = randomTunnelPoint(radius, depth);
    const stride = index * 6;
    const length = 1.8 + Math.random() * 4.2;

    positions[stride] = point.x;
    positions[stride + 1] = point.y;
    positions[stride + 2] = point.z;
    positions[stride + 3] = point.x;
    positions[stride + 4] = point.y;
    positions[stride + 5] = point.z - length;
  }

  return positions;
}

function updateStreakSegments(
  ref: RefObject<LineSegments | null>,
  radius: number,
  depth: number,
  speed: number,
  delta: number,
  exitZ = 18
) {
  if (!ref.current || speed <= 0.0001) {
    return;
  }

  const positionAttribute = ref.current.geometry.attributes.position as THREE.BufferAttribute;
  const values = positionAttribute.array as Float32Array;

  for (let index = 0; index < values.length; index += 6) {
    values[index + 2] += speed * delta * 18;
    values[index + 5] += speed * delta * 18;

    if (values[index + 2] > exitZ) {
      const point = randomTunnelPoint(radius, depth);
      const length = 1.8 + Math.random() * 4.2;
      values[index] = point.x;
      values[index + 1] = point.y;
      values[index + 2] = -depth - Math.random() * 12;
      values[index + 3] = point.x;
      values[index + 4] = point.y;
      values[index + 5] = values[index + 2] - length;
    }
  }

  positionAttribute.needsUpdate = true;
}

function tuneStreakLines(
  ref: RefObject<LineSegments | null>,
  opacity: number
) {
  if (!ref.current) {
    return;
  }

  const material = ref.current.material as THREE.LineBasicMaterial;
  material.opacity = THREE.MathUtils.lerp(material.opacity, opacity, 0.08);
}

function SpritePoints({
  pointSprite,
  positions,
  colors,
  color,
  size,
  opacity,
  pointRef
}: {
  pointSprite: Texture | null;
  positions: Float32Array;
  colors?: Float32Array;
  color?: string;
  size: number;
  opacity: number;
  pointRef?: RefObject<Points | null>;
}) {
  return (
    <points ref={pointRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        {colors ? <bufferAttribute attach="attributes-color" args={[colors, 3]} /> : null}
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        vertexColors={Boolean(colors)}
        blending={THREE.AdditiveBlending}
        map={pointSprite ?? undefined}
        alphaMap={pointSprite ?? undefined}
      />
    </points>
  );
}

export function WorldScene({
  activeSection,
  pointer,
  reducedMotion,
  sectionProgress,
  scrollProgress,
  scrollVelocity
}: SceneProps) {
  const tunnelFarRef = useRef<Points>(null);
  const tunnelMidRef = useRef<Points>(null);
  const tunnelNearRef = useRef<Points>(null);
  const streakRef = useRef<Points>(null);
  const streakLinesRef = useRef<LineSegments>(null);
  const galaxyRef = useRef<Group>(null);
  const starfieldRef = useRef<Group>(null);

  const farPositions = useMemo(() => createTunnelPositions(900, 26, TUNNEL_DEPTH), []);
  const midPositions = useMemo(() => createTunnelPositions(560, 18, TUNNEL_DEPTH), []);
  const nearPositions = useMemo(() => createTunnelPositions(420, 12, TUNNEL_DEPTH), []);
  const streakPositions = useMemo(() => createTunnelPositions(260, 10, TUNNEL_DEPTH), []);
  const streakLinePositions = useMemo(() => createStreakSegments(120, 11, TUNNEL_DEPTH), []);
  const galaxyCore = useMemo(() => createGalaxyCore(3600), []);
  const galaxyDust = useMemo(() => createCoreDust(1800), []);
  const galaxyHalo = useMemo(() => createHaloCloud(2200), []);
  const galaxyInnerGlow = useMemo(() => createInnerCoreGlow(1400), []);
  const galaxyFalloff = useMemo(() => createCoreFalloff(1800), []);
  const galaxyDustHaze = useMemo(() => createDustHaze(4200), []);
  const galaxyPinkClusters = useMemo(() => createPinkClusters(520), []);
  const spiralArcs = useMemo(() => createSpiralArcs(2200), []);
  const pointSprite = useMemo(() => createPointSprite(), []);

  useFrame((state, delta) => {
    const target = sectionTargets[activeSection] ?? sectionTargets.hero;
    const time = state.clock.getElapsedTime();
    const tunnelImpulse = reducedMotion
      ? 0
      : THREE.MathUtils.clamp((scrollVelocity - 0.012) * 8.4, 0, 1.6);
    const dollyImpulse = reducedMotion ? 0 : Math.min(scrollVelocity * 0.56, 0.4);
    const forwardTravel = reducedMotion ? 0 : scrollProgress * 1.22;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      target.cameraX + (reducedMotion ? 0 : pointer.x * 0.12),
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      target.cameraY + (reducedMotion ? 0 : pointer.y * -0.09),
      0.05
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      target.cameraZ - forwardTravel - dollyImpulse,
      0.045
    );
    state.camera.lookAt(target.coreX * 0.72, target.coreY * 0.4, -58.8 - forwardTravel * 3.2);

    if (starfieldRef.current) {
      starfieldRef.current.rotation.z = THREE.MathUtils.lerp(
        starfieldRef.current.rotation.z,
        reducedMotion ? 0 : pointer.x * 0.018,
        0.03
      );
      starfieldRef.current.rotation.x = THREE.MathUtils.lerp(
        starfieldRef.current.rotation.x,
        reducedMotion ? 0 : pointer.y * 0.014,
        0.03
      );
    }

    updateTunnel(tunnelFarRef, 26, TUNNEL_DEPTH, tunnelImpulse * 0.38, delta, 16);
    updateTunnel(tunnelMidRef, 18, TUNNEL_DEPTH, tunnelImpulse * 0.78, delta, 18);
    updateTunnel(tunnelNearRef, 12, TUNNEL_DEPTH, tunnelImpulse * 1.45, delta, 22);
    updateTunnel(streakRef, 10, TUNNEL_DEPTH, tunnelImpulse * (1.8 + scrollVelocity * 0.5), delta, 24);
    updateStreakSegments(
      streakLinesRef,
      11,
      TUNNEL_DEPTH,
      tunnelImpulse * (1.4 + scrollVelocity * 0.3),
      delta,
      24
    );

    tuneTunnelMaterial(tunnelFarRef, 0.045 + tunnelImpulse * 0.024, 0.018 + tunnelImpulse * 0.0015);
    tuneTunnelMaterial(tunnelMidRef, 0.075 + tunnelImpulse * 0.045, 0.024 + tunnelImpulse * 0.005);
    tuneTunnelMaterial(tunnelNearRef, 0.1 + tunnelImpulse * 0.08, 0.03 + tunnelImpulse * 0.016);
    tuneTunnelMaterial(streakRef, 0.002 + tunnelImpulse * 0.11, 0.02 + tunnelImpulse * 0.055);
    tuneStreakLines(streakLinesRef, 0.004 + tunnelImpulse * 0.12);

    if (galaxyRef.current) {
      const targetScale = target.coreScale * 1.18 + scrollProgress * 0.34 + sectionProgress * 0.05;
      const scale = THREE.MathUtils.lerp(galaxyRef.current.scale.x, targetScale, 0.04);
      galaxyRef.current.scale.setScalar(scale);
      galaxyRef.current.rotation.z += reducedMotion ? 0 : 0.00018;
      galaxyRef.current.rotation.y = THREE.MathUtils.lerp(
        galaxyRef.current.rotation.y,
        reducedMotion ? 0 : pointer.x * 0.05,
        0.03
      );
      galaxyRef.current.position.x = THREE.MathUtils.lerp(
        galaxyRef.current.position.x,
        target.coreX + (reducedMotion ? 0 : pointer.x * 0.12),
        0.03
      );
      galaxyRef.current.position.y = THREE.MathUtils.lerp(
        galaxyRef.current.position.y,
        target.coreY + target.cameraY * 2.8 + Math.sin(time * 0.1) * 0.04,
        0.025
      );
      galaxyRef.current.position.z = THREE.MathUtils.lerp(
        galaxyRef.current.position.z,
        scrollProgress * 1.12,
        0.035
      );
    }
  });

  return (
    <group ref={starfieldRef}>
      <group ref={galaxyRef} position={[0.55, 0.18, 0]}>
        <group position={[0, 0, -4]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={galaxyHalo}
            color="#6f63ff"
            size={0.22}
            opacity={0.14}
          />
        </group>

        <group position={[0, 0, -0.6]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={galaxyFalloff}
            color="#6e5dff"
            size={0.42}
            opacity={0.12}
          />
        </group>

        <group position={[0.04, 0, -1.8]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={galaxyDustHaze}
            color="#d8defd"
            size={0.22}
            opacity={0.055}
          />
        </group>

        <group position={[0, 0, 0.4]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={galaxyInnerGlow}
            color="#fff3f7"
            size={0.3}
            opacity={0.28}
          />
        </group>

        <SpritePoints
          pointSprite={pointSprite}
          positions={galaxyCore.positions}
          colors={galaxyCore.colors}
          size={0.122}
          opacity={0.9}
        />

        <group position={[0, 0, -2]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={galaxyDust}
            color="#c89cff"
            size={0.2}
            opacity={(sectionTargets[activeSection]?.coreOpacity ?? 0.3) * 0.28}
          />
        </group>

        <group position={[0, 0, -3]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={galaxyCore.positions}
            colors={galaxyCore.colors}
            size={0.074}
            opacity={0.42}
          />
        </group>

        <group position={[0.06, 0, -0.8]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={galaxyPinkClusters}
            color="#ff7eb6"
            size={0.19}
            opacity={0.34}
          />
        </group>

        <group position={[0.3, 0, -1]}>
          <SpritePoints
            pointSprite={pointSprite}
            positions={spiralArcs}
            color="#a7a8ff"
            size={0.12}
            opacity={0.48}
          />
        </group>
      </group>

      <SpritePoints
        pointSprite={pointSprite}
        pointRef={tunnelFarRef}
        positions={farPositions}
        color="#8ab4ff"
        size={0.019}
        opacity={0.07}
      />

      <SpritePoints
        pointSprite={pointSprite}
        pointRef={tunnelMidRef}
        positions={midPositions}
        color="#bfeaff"
        size={0.028}
        opacity={0.12}
      />

      <SpritePoints
        pointSprite={pointSprite}
        pointRef={tunnelNearRef}
        positions={nearPositions}
        color="#f5fbff"
        size={0.038}
        opacity={0.16}
      />

      <SpritePoints
        pointSprite={pointSprite}
        pointRef={streakRef}
        positions={streakPositions}
        color="#f7fcff"
        size={0.028}
        opacity={0.003}
      />

      <lineSegments ref={streakLinesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[streakLinePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#dff4ff"
          transparent
          opacity={0.004}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
