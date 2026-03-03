"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group, Points, Texture } from "three";
import * as THREE from "three";

type ParticleGalaxySceneProps = {
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
    galaxyX: number;
    galaxyY: number;
    galaxyScale: number;
  }
> = {
  hero: {
    cameraX: 0,
    cameraY: 0.08,
    cameraZ: 9.4,
    galaxyX: 1.04,
    galaxyY: 0.04,
    galaxyScale: 1.28,
  },
  availability: {
    cameraX: 0.01,
    cameraY: 0.08,
    cameraZ: 9.1,
    galaxyX: 1.08,
    galaxyY: 0.06,
    galaxyScale: 1.36,
  },
  about: {
    cameraX: 0.02,
    cameraY: 0.05,
    cameraZ: 8.55,
    galaxyX: 1.14,
    galaxyY: 0.05,
    galaxyScale: 1.48,
  },
  "motion-dna": {
    cameraX: 0.03,
    cameraY: 0.04,
    cameraZ: 8.1,
    galaxyX: 1.2,
    galaxyY: 0.05,
    galaxyScale: 1.58,
  },
  skills: {
    cameraX: 0.03,
    cameraY: 0.03,
    cameraZ: 7.7,
    galaxyX: 1.24,
    galaxyY: 0.05,
    galaxyScale: 1.7,
  },
  process: {
    cameraX: 0.03,
    cameraY: 0.02,
    cameraZ: 7.35,
    galaxyX: 1.28,
    galaxyY: 0.04,
    galaxyScale: 1.82,
  },
  projects: {
    cameraX: 0.04,
    cameraY: 0.01,
    cameraZ: 7.05,
    galaxyX: 1.32,
    galaxyY: 0.04,
    galaxyScale: 1.94,
  },
  timeline: {
    cameraX: 0.04,
    cameraY: 0,
    cameraZ: 6.85,
    galaxyX: 1.34,
    galaxyY: 0.03,
    galaxyScale: 2.02,
  },
  contact: {
    cameraX: 0.04,
    cameraY: -0.01,
    cameraZ: 6.8,
    galaxyX: 1.28,
    galaxyY: 0.02,
    galaxyScale: 1.92,
  },
};

function createPointSprite() {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.18, "rgba(255,255,255,0.98)");
  gradient.addColorStop(0.42, "rgba(255,255,255,0.4)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createBackgroundStars(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const scales = new Float32Array(count);
  const highlights = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    positions[stride] = (Math.random() - 0.5) * 120;
    positions[stride + 1] = (Math.random() - 0.5) * 74;
    positions[stride + 2] = -18 - Math.random() * 136;

    const base = 0.28 + Math.random() * 0.72;
    colors[stride] = base;
    colors[stride + 1] = base * 0.98;
    colors[stride + 2] = base;
    phases[index] = Math.random() * Math.PI * 2;
    scales[index] = 0.32 + Math.random() * 0.96;
    highlights[index] = Math.random() > 0.93 ? 1 : 0;
  }

  return { positions, colors, phases, scales, highlights };
}

function createGalaxyLayer(
  count: number,
  branches: number,
  radiusLimit: number,
  randomScale: number,
  yScale: number,
  spinScale: number,
  coreBias = 0,
) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const coreColor = new THREE.Color("#fff9f7");
  const pinkColor = new THREE.Color("#ffb3da");
  const violetColor = new THREE.Color("#b06eff");
  const blueEdge = new THREE.Color("#90a7ff");

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const branch = index % branches;
    const radius = Math.pow(Math.random(), 0.72 + coreBias) * radiusLimit;
    const branchAngle = (branch / branches) * Math.PI * 2;
    const spinAngle = radius * spinScale;
    const armTightness = 0.1 + radius * 0.014;
    const angle =
      branchAngle + spinAngle + (Math.random() - 0.5) * armTightness;

    const offsetX =
      Math.pow(Math.random(), 1.7) *
      (Math.random() > 0.5 ? 1 : -1) *
      (0.08 + radius * randomScale);
    const offsetZ =
      Math.pow(Math.random(), 1.7) *
      (Math.random() > 0.5 ? 1 : -1) *
      (0.08 + radius * randomScale * 0.92);
    const offsetY =
      Math.pow(Math.random(), 1.9) *
      (Math.random() > 0.5 ? 1 : -1) *
      (0.02 + radius * yScale);

    positions[stride] = Math.cos(angle) * radius * 1.36 + offsetX;
    positions[stride + 1] = offsetY;
    positions[stride + 2] = Math.sin(angle) * radius * 0.82 + offsetZ;

    const mix = Math.min(1, radius / radiusLimit);
    const color = coreColor
      .clone()
      .lerp(pinkColor, mix * 0.74)
      .lerp(violetColor, Math.max(0, mix - 0.16) * 0.82)
      .lerp(blueEdge, Math.max(0, mix - 0.48) * 0.56);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  return { positions, colors };
}

function createCoreLayer(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const white = new THREE.Color("#ffffff");
  const warm = new THREE.Color("#ffe3f2");

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = Math.pow(Math.random(), 2.2) * 1.7;
    const angle = Math.random() * Math.PI * 2;

    positions[stride] = Math.cos(angle) * radius;
    positions[stride + 1] = (Math.random() - 0.5) * 0.08;
    positions[stride + 2] = Math.sin(angle) * radius * 0.8;

    const color = white.clone().lerp(warm, Math.random() * 0.32);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  return { positions, colors };
}

function createBulgeLayer(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const white = new THREE.Color("#fffdfb");
  const pink = new THREE.Color("#ffd8ec");
  const violet = new THREE.Color("#d8b4fe");

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    const radius = Math.pow(Math.random(), 1.8) * 3.6;
    const angle = Math.random() * Math.PI * 2;
    const vertical = (Math.random() - 0.5) * (0.12 + (1 - radius / 3.6) * 1.2);

    positions[stride] = Math.cos(angle) * radius * 1.02;
    positions[stride + 1] = vertical;
    positions[stride + 2] = Math.sin(angle) * radius * 0.88;

    const mix = Math.min(1, radius / 3.6);
    const color = white
      .clone()
      .lerp(pink, mix * 0.55)
      .lerp(violet, Math.max(0, mix - 0.34) * 0.4);
    colors[stride] = color.r;
    colors[stride + 1] = color.g;
    colors[stride + 2] = color.b;
  }

  return { positions, colors };
}

function SpritePoints({
  pointSprite,
  positions,
  colors,
  size,
  opacity,
  pointRef
}: {
  pointSprite: Texture | null;
  positions: Float32Array;
  colors: Float32Array;
  size: number;
  opacity: number;
  pointRef?: RefObject<Points | null>;
}) {
  return (
    <points ref={pointRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
        map={pointSprite ?? undefined}
        alphaMap={pointSprite ?? undefined}
      />
    </points>
  );
}

export function ParticleGalaxyScene({
  activeSection,
  pointer,
  reducedMotion,
  sectionProgress,
  scrollProgress,
  scrollVelocity,
}: ParticleGalaxySceneProps) {
  const starfieldRef = useRef<Group>(null);
  const galaxyRef = useRef<Group>(null);
  const starsRef = useRef<Points>(null);
  const armsRef = useRef<Points>(null);
  const dustRef = useRef<Points>(null);
  const bulgeRef = useRef<Points>(null);
  const coreRef = useRef<Points>(null);

  const pointSprite = useMemo(() => createPointSprite(), []);
  const backgroundStars = useMemo(() => createBackgroundStars(1200), []);
  const galaxyArms = useMemo(
    () => createGalaxyLayer(7600, 4, 10.8, 0.12, 0.018, 1.02),
    [],
  );
  const galaxyDust = useMemo(
    () => createGalaxyLayer(5200, 4, 12.6, 0.22, 0.042, 0.94, 0.08),
    [],
  );
  const galaxyBulge = useMemo(() => createBulgeLayer(2600), []);
  const galaxyCore = useMemo(() => createCoreLayer(2200), []);

  useFrame((state) => {
    const target = sectionTargets[activeSection] ?? sectionTargets.hero;
    const time = state.clock.getElapsedTime();
    const scrollKick = THREE.MathUtils.clamp(
      Math.abs(scrollVelocity) * 2.2,
      0,
      1,
    );
    const cameraZoom = THREE.MathUtils.clamp(
      (10 - state.camera.position.z) / 3.1,
      0,
      1.35,
    );

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      target.cameraX + (reducedMotion ? 0 : pointer.x * 0.1),
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      target.cameraY + (reducedMotion ? 0 : pointer.y * -0.07),
      0.04,
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      target.cameraZ - scrollProgress * 0.08 - scrollKick * 0.08,
      0.04,
    );
    state.camera.lookAt(target.galaxyX * 0.42, target.galaxyY * 0.22, 0);

    if (starfieldRef.current) {
      starfieldRef.current.rotation.z = THREE.MathUtils.lerp(
        starfieldRef.current.rotation.z,
        reducedMotion ? 0 : pointer.x * 0.01,
        0.02,
      );
      starfieldRef.current.rotation.x = THREE.MathUtils.lerp(
        starfieldRef.current.rotation.x,
        reducedMotion ? 0 : pointer.y * 0.01,
        0.02,
      );
    }

    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      const colorAttribute = starsRef.current.geometry.attributes
        .color as THREE.BufferAttribute;
      const values = colorAttribute.array as Float32Array;

      for (let index = 0; index < backgroundStars.phases.length; index += 1) {
        const stride = index * 3;
        const burst =
          backgroundStars.highlights[index] > 0
            ? Math.pow(
                Math.max(0, Math.sin(time * 2 + backgroundStars.phases[index])),
                8,
              ) * 0.55
            : 0;
        const twinkle =
          0.4 +
          Math.sin(
            time * (0.42 + backgroundStars.scales[index] * 0.5) +
              backgroundStars.phases[index],
          ) *
            0.16 *
            backgroundStars.scales[index];
        const brightness = THREE.MathUtils.clamp(twinkle + burst, 0.12, 1.15);

        values[stride] = brightness;
        values[stride + 1] = brightness * 0.98;
        values[stride + 2] = brightness;
      }

      colorAttribute.needsUpdate = true;
      material.size = THREE.MathUtils.lerp(
        material.size,
        0.045 + cameraZoom * 0.018,
        0.05,
      );
    }

    if (galaxyRef.current) {
      const targetScale =
        target.galaxyScale +
        scrollProgress * 0.018 +
        sectionProgress * 0.05 +
        scrollKick * 0.04;
      const scale = THREE.MathUtils.lerp(
        galaxyRef.current.scale.x,
        targetScale,
        0.05,
      );

      galaxyRef.current.scale.setScalar(scale);
      galaxyRef.current.position.x = THREE.MathUtils.lerp(
        galaxyRef.current.position.x,
        target.galaxyX + (reducedMotion ? 0 : pointer.x * 0.12),
        0.04,
      );
      galaxyRef.current.position.y = THREE.MathUtils.lerp(
        galaxyRef.current.position.y,
        target.galaxyY + (reducedMotion ? 0 : pointer.y * 0.08),
        0.04,
      );
      galaxyRef.current.rotation.x = THREE.MathUtils.lerp(
        galaxyRef.current.rotation.x,
        1.18 + (reducedMotion ? 0 : pointer.y * 0.05),
        0.04,
      );
      galaxyRef.current.rotation.y = THREE.MathUtils.lerp(
        galaxyRef.current.rotation.y,
        0.24 + (reducedMotion ? 0 : pointer.x * 0.08),
        0.04,
      );
      galaxyRef.current.rotation.z += reducedMotion
        ? 0
        : 0.0007 + scrollKick * 0.00024;
    }

    if (armsRef.current) {
      const material = armsRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        0.032 + cameraZoom * 0.014,
        0.06,
      );
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.88, 0.05);
    }

    if (dustRef.current) {
      const material = dustRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        0.013 + cameraZoom * 0.008,
        0.06,
      );
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.22, 0.05);
    }

    if (bulgeRef.current) {
      const material = bulgeRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        0.024 + cameraZoom * 0.016,
        0.07,
      );
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.48, 0.05);
    }

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        0.07 + cameraZoom * 0.024,
        0.08,
      );
    }
  });

  return (
    <group ref={starfieldRef}>
      <SpritePoints
        pointSprite={pointSprite}
        pointRef={starsRef}
        positions={backgroundStars.positions}
        colors={backgroundStars.colors}
        size={0.05}
        opacity={0.82}
      />

      <group
        ref={galaxyRef}
        position={[1.08, 0.04, -2]}
        rotation={[1.18, 0.24, 0.12]}
      >
        <group rotation={[0.08, 0, 0]}>
          <SpritePoints
            pointSprite={pointSprite}
            pointRef={dustRef}
            positions={galaxyDust.positions}
            colors={galaxyDust.colors}
            size={0.02}
            opacity={0.22}
          />
        </group>

        <group rotation={[0.04, 0, 0]}>
          <SpritePoints
            pointSprite={pointSprite}
            pointRef={armsRef}
            positions={galaxyArms.positions}
            colors={galaxyArms.colors}
            size={0.034}
            opacity={0.88}
          />
        </group>

        <group rotation={[-0.08, 0.14, 0]}>
          <SpritePoints
            pointSprite={pointSprite}
            pointRef={bulgeRef}
            positions={galaxyBulge.positions}
            colors={galaxyBulge.colors}
            size={0.026}
            opacity={0.48}
          />
        </group>

        <SpritePoints
          pointSprite={pointSprite}
          pointRef={coreRef}
          positions={galaxyCore.positions}
          colors={galaxyCore.colors}
          size={0.074}
          opacity={1}
        />
      </group>
    </group>
  );
}
