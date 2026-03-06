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
    tiltX: number;
    yawY: number;
  }
> = {
  hero: {
    cameraX: 0,
    cameraY: 0.08,
    cameraZ: 9.4,
    galaxyX: 1.08,
    galaxyY: 0.02,
    galaxyScale: 0.9,
    tiltX: 0.98,
    yawY: 0.14,
  },
  availability: {
    cameraX: 0.01,
    cameraY: 0.08,
    cameraZ: 9.1,
    galaxyX: 1.08,
    galaxyY: 0.06,
    galaxyScale: 0.92,
    tiltX: 1.02,
    yawY: 0.16,
  },
  about: {
    cameraX: 0.02,
    cameraY: 0.05,
    cameraZ: 8.35,
    galaxyX: 1.38,
    galaxyY: -0.04,
    galaxyScale: 0.88,
    tiltX: 0.98,
    yawY: 0.13,
  },
  "motion-dna": {
    cameraX: 0.03,
    cameraY: 0.04,
    cameraZ: 8.1,
    galaxyX: 1.2,
    galaxyY: 0.05,
    galaxyScale: 1.08,
    tiltX: 1.08,
    yawY: 0.19,
  },
  skills: {
    cameraX: 0.03,
    cameraY: 0.03,
    cameraZ: 7.5,
    galaxyX: 1.38,
    galaxyY: -0.08,
    galaxyScale: 1.02,
    tiltX: 1,
    yawY: 0.15,
  },
  process: {
    cameraX: 0.03,
    cameraY: 0.02,
    cameraZ: 7.35,
    galaxyX: 1.42,
    galaxyY: -0.1,
    galaxyScale: 1.08,
    tiltX: 1.12,
    yawY: 0.21,
  },
  projects: {
    cameraX: 0.04,
    cameraY: 0.01,
    cameraZ: 6.9,
    galaxyX: 1.56,
    galaxyY: -0.16,
    galaxyScale: 0.98,
    tiltX: 1.04,
    yawY: 0.17,
  },
  timeline: {
    cameraX: 0.04,
    cameraY: 0,
    cameraZ: 6.7,
    galaxyX: 1.62,
    galaxyY: -0.18,
    galaxyScale: 0.92,
    tiltX: 1.08,
    yawY: 0.19,
  },
  contact: {
    cameraX: 0.04,
    cameraY: -0.01,
    cameraZ: 6.8,
    galaxyX: 1.58,
    galaxyY: -0.18,
    galaxyScale: 0.86,
    tiltX: 1.14,
    yawY: 0.22,
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

function createGlowTexture() {
  const size = 512;
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
    size * 0.04,
    size / 2,
    size / 2,
    size * 0.48,
  );
  gradient.addColorStop(0, "rgba(255,250,250,0.95)");
  gradient.addColorStop(0.18, "rgba(255,220,240,0.42)");
  gradient.addColorStop(0.42, "rgba(192,132,252,0.12)");
  gradient.addColorStop(1, "rgba(192,132,252,0)");

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
    const branchSkew = 0.86 + ((branch % 2 === 0 ? 1 : -1) * 0.12 + branch * 0.03);
    const spinAngle = radius * spinScale;
    const armWave =
      Math.sin(radius * 0.9 + branch * 1.7) * 0.5 +
      Math.sin(radius * 1.8 - branch * 0.8) * 0.28;
    const armDensity = 0.72 + armWave * 0.22 + Math.sin(radius * 0.34 + branch) * 0.08;
    const clusterBias = Math.random();
    const clusterTightness = clusterBias > armDensity ? 1.9 : 1;
    const armTightness = (0.035 + radius * 0.008) / clusterTightness;
    const angle =
      branchAngle + spinAngle + (Math.random() - 0.5) * armTightness;
    const asymmetry = 1 + Math.sin(radius * 0.42 + branch * 1.4) * 0.08;
    const innerCompression = 1 - Math.min(0.18, radius / radiusLimit * 0.12);

    const offsetX =
      Math.pow(Math.random(), 1.7) *
      (Math.random() > 0.5 ? 1 : -1) *
      (0.05 + radius * randomScale * (clusterBias > armDensity ? 0.6 : 1));
    const offsetZ =
      Math.pow(Math.random(), 1.7) *
      (Math.random() > 0.5 ? 1 : -1) *
      (0.05 + radius * randomScale * 0.92 * (clusterBias > armDensity ? 0.6 : 1));
    const offsetY =
      Math.pow(Math.random(), 1.9) *
      (Math.random() > 0.5 ? 1 : -1) *
      (0.014 + radius * yScale * (clusterBias > armDensity ? 0.7 : 1));

    positions[stride] =
      Math.cos(angle) * radius * 1.36 * branchSkew * asymmetry + offsetX;
    positions[stride + 1] = offsetY;
    positions[stride + 2] =
      Math.sin(angle) * radius * 0.82 * innerCompression + offsetZ;

    const mix = Math.min(1, radius / radiusLimit);
    const pulse = 0.92 + Math.max(0, armWave) * 0.12;
    const color = coreColor
      .clone()
      .lerp(pinkColor, mix * 0.74)
      .lerp(violetColor, Math.max(0, mix - 0.16) * 0.82)
      .lerp(blueEdge, Math.max(0, mix - 0.48) * 0.56);
    colors[stride] = color.r * pulse;
    colors[stride + 1] = color.g * pulse;
    colors[stride + 2] = color.b * pulse;
  }

  return { positions, colors };
}

function tintColors(
  source: Float32Array,
  colorA: string,
  colorB: string,
  strength = 0.5,
) {
  const result = new Float32Array(source.length);
  const a = new THREE.Color(colorA);
  const b = new THREE.Color(colorB);

  for (let index = 0; index < source.length; index += 3) {
    const base = new THREE.Color(source[index], source[index + 1], source[index + 2]);
    const bias = ((index / 3) % 7) / 6;
    const tint = a.clone().lerp(b, bias);
    base.lerp(tint, strength);
    result[index] = base.r;
    result[index + 1] = base.g;
    result[index + 2] = base.b;
  }

  return result;
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
  const discRef = useRef<Group>(null);
  const dustGroupRef = useRef<Group>(null);
  const frontDustGroupRef = useRef<Group>(null);
  const armsGroupRef = useRef<Group>(null);
  const bulgeGroupRef = useRef<Group>(null);
  const coreGroupRef = useRef<Group>(null);
  const starsRef = useRef<Points>(null);
  const armsRef = useRef<Points>(null);
  const outerArmsRef = useRef<Points>(null);
  const dustRef = useRef<Points>(null);
  const frontDustRef = useRef<Points>(null);
  const bulgeRef = useRef<Points>(null);
  const coreRef = useRef<Points>(null);
  const interactionPlane = useMemo(() => new THREE.Plane(), []);
  const pointerVector = useMemo(() => new THREE.Vector2(), []);
  const planeNormal = useMemo(() => new THREE.Vector3(), []);
  const planePoint = useMemo(() => new THREE.Vector3(), []);
  const cursorLocal = useMemo(() => new THREE.Vector3(), []);
  const cursorWorld = useMemo(() => new THREE.Vector3(), []);
  const worldQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const starTwinkleTimer = useRef(0);
  const repulsionTimer = useRef(0);
  const pointerRaycastTimer = useRef(0);
  const hasParticleMomentum = useRef(false);

  const pointSprite = useMemo(() => createPointSprite(), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const backgroundStars = useMemo(() => createBackgroundStars(980), []);
  const galaxyArms = useMemo(
    () => createGalaxyLayer(5200, 4, 8.2, 0.08, 0.014, 1.1),
    [],
  );
  const galaxyOuterArms = useMemo(
    () => createGalaxyLayer(4200, 4, 12.8, 0.16, 0.024, 0.9, 0.06),
    [],
  );
  const galaxyDust = useMemo(
    () => createGalaxyLayer(3000, 4, 12.6, 0.16, 0.032, 0.94, 0.08),
    [],
  );
  const dustPositions = useMemo(
    () => new Float32Array(galaxyDust.positions),
    [galaxyDust.positions],
  );
  const frontDustPositions = useMemo(
    () => new Float32Array(galaxyDust.positions),
    [galaxyDust.positions],
  );
  const galaxyBulge = useMemo(() => createBulgeLayer(1500), []);
  const galaxyCore = useMemo(() => createCoreLayer(1100), []);
  const outerArmsBasePositions = useMemo(
    () => new Float32Array(galaxyOuterArms.positions),
    [galaxyOuterArms.positions],
  );
  const dustBasePositions = useMemo(
    () => new Float32Array(galaxyDust.positions),
    [galaxyDust.positions],
  );
  const outerArmsVelocity = useMemo(
    () => new Float32Array(galaxyOuterArms.positions.length),
    [galaxyOuterArms.positions.length],
  );
  const dustVelocity = useMemo(
    () => new Float32Array(galaxyDust.positions.length),
    [galaxyDust.positions.length],
  );
  const frontDustVelocity = useMemo(
    () => new Float32Array(galaxyDust.positions.length),
    [galaxyDust.positions.length],
  );
  const armColors = useMemo(
    () => tintColors(galaxyArms.colors, "#ffd0ea", "#c084fc", 0.34),
    [galaxyArms.colors],
  );
  const outerArmColors = useMemo(
    () => tintColors(galaxyOuterArms.colors, "#f9a8d4", "#818cf8", 0.42),
    [galaxyOuterArms.colors],
  );
  const dustColors = useMemo(
    () => tintColors(galaxyDust.colors, "#c4b5fd", "#93c5fd", 0.18),
    [galaxyDust.colors],
  );

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 1 / 20);
    const frameScale = clampedDelta * 60;
    const target = sectionTargets[activeSection] ?? sectionTargets.hero;
    const sectionEnergy =
      activeSection === "hero"
        ? 1.08
        : activeSection === "availability"
          ? 1.02
          : activeSection === "contact"
            ? 0.72
            : 0.9;
    const time = state.clock.getElapsedTime();
    const scrollKick = THREE.MathUtils.clamp(
      Math.abs(scrollVelocity) * 2.2,
      0,
      1,
    );
    const pointerStrength = Math.hypot(pointer.x, pointer.y);
    const interactionActive = !reducedMotion && pointerStrength > 0.02;
    const pointerInfluence = reducedMotion
      ? 0
      : THREE.MathUtils.clamp(pointerStrength, 0, 1);
    const ambientSpinFactor = reducedMotion ? 0.24 : 1;
    const cameraZoom = THREE.MathUtils.clamp(
      (10 - state.camera.position.z) / 3.1,
      0,
      1.35,
    );

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      target.cameraX,
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      target.cameraY,
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
        reducedMotion ? 0 : pointer.x * 0.05,
        0.03,
      );
      starfieldRef.current.rotation.x = THREE.MathUtils.lerp(
        starfieldRef.current.rotation.x,
        reducedMotion ? 0 : pointer.y * -0.034,
        0.03,
      );
    }

    starTwinkleTimer.current += clampedDelta;
    const shouldUpdateTwinkle = starTwinkleTimer.current >= 1 / 28;

    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      if (shouldUpdateTwinkle) {
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
        starTwinkleTimer.current = 0;
      }
      material.size = THREE.MathUtils.lerp(
        material.size,
        (0.04 + cameraZoom * 0.014) *
          (0.9 + sectionEnergy * 0.08 + pointerInfluence * 0.04),
        0.05,
      );
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        0.62 * (0.88 + sectionEnergy * 0.12 + pointerInfluence * 0.05),
        0.05,
      );
    }

    if (galaxyRef.current) {
      const sectionScaleBoost =
        activeSection === "hero"
          ? 0.02
          : activeSection === "projects"
            ? -0.04
            : activeSection === "timeline"
              ? -0.06
              : activeSection === "contact"
                ? -0.08
                : 0;
      const targetScale =
        target.galaxyScale +
        scrollProgress * 0.004 +
        sectionProgress * 0.016 +
        scrollKick * 0.012 +
        sectionScaleBoost;
      const scale = THREE.MathUtils.lerp(
        galaxyRef.current.scale.x,
        targetScale,
        0.05,
      );

      galaxyRef.current.scale.setScalar(scale);
      galaxyRef.current.position.x = THREE.MathUtils.lerp(
        galaxyRef.current.position.x,
        target.galaxyX,
        0.04,
      );
      galaxyRef.current.position.y = THREE.MathUtils.lerp(
        galaxyRef.current.position.y,
        target.galaxyY,
        0.04,
      );
      galaxyRef.current.rotation.x = THREE.MathUtils.lerp(
        galaxyRef.current.rotation.x,
        target.tiltX,
        0.04,
      );
      galaxyRef.current.rotation.y = THREE.MathUtils.lerp(
        galaxyRef.current.rotation.y,
        target.yawY,
        0.04,
      );
      galaxyRef.current.rotation.z = THREE.MathUtils.lerp(
        galaxyRef.current.rotation.z,
        0.08,
        0.04,
      );
    }

    if (discRef.current) {
      discRef.current.rotation.y +=
        (0.00056 + scrollKick * 0.00012) * frameScale * ambientSpinFactor;
      discRef.current.rotation.x = THREE.MathUtils.lerp(
        discRef.current.rotation.x,
        0.04,
        0.04,
      );
    }

    if (armsGroupRef.current) {
      armsGroupRef.current.rotation.y += 0.00078 * frameScale * ambientSpinFactor;
    }

    if (dustGroupRef.current) {
      dustGroupRef.current.rotation.y += 0.00034 * frameScale * ambientSpinFactor;
      dustGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        dustGroupRef.current.rotation.x,
        0.12 + Math.sin(time * 0.22) * 0.02,
        0.03,
      );
    }

    if (frontDustGroupRef.current) {
      frontDustGroupRef.current.rotation.y += 0.00048 * frameScale * ambientSpinFactor;
      frontDustGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        frontDustGroupRef.current.rotation.x,
        -0.1 + Math.sin(time * 0.24) * 0.03,
        0.03,
      );
      frontDustGroupRef.current.position.z = THREE.MathUtils.lerp(
        frontDustGroupRef.current.position.z,
        0.24 + Math.sin(time * 0.28) * 0.04,
        0.03,
      );
    }

    if (bulgeGroupRef.current) {
      bulgeGroupRef.current.rotation.y += 0.00044 * frameScale * ambientSpinFactor;
      bulgeGroupRef.current.position.z = THREE.MathUtils.lerp(
        bulgeGroupRef.current.position.z,
        Math.sin(time * 0.35) * 0.08,
        0.03,
      );
    }

    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y += 0.00062 * frameScale * ambientSpinFactor;
      coreGroupRef.current.position.z = THREE.MathUtils.lerp(
        coreGroupRef.current.position.z,
        Math.sin(time * 0.4) * 0.05,
        0.04,
      );
    }

    if (armsRef.current) {
      const material = armsRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        (0.032 + cameraZoom * 0.014) * (0.92 + sectionEnergy * 0.1),
        0.06,
      );
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        0.82 * (0.86 + sectionEnergy * 0.16),
        0.05,
      );
    }

    if (outerArmsRef.current) {
      const material = outerArmsRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        (0.026 + cameraZoom * 0.011) * (0.92 + sectionEnergy * 0.1),
        0.06,
      );
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        0.58 * (0.86 + sectionEnergy * 0.16),
        0.05,
      );
    }

    if (dustRef.current) {
      const material = dustRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        (0.01 + cameraZoom * 0.005) * (0.88 + sectionEnergy * 0.08),
        0.06,
      );
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        0.09 * (0.8 + sectionEnergy * 0.14),
        0.05,
      );
    }

    if (bulgeRef.current) {
      const material = bulgeRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        (0.018 + cameraZoom * 0.01) * (0.9 + sectionEnergy * 0.08),
        0.07,
      );
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        0.22 * (0.82 + sectionEnergy * 0.14),
        0.05,
      );
    }

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.PointsMaterial;
      material.size = THREE.MathUtils.lerp(
        material.size,
        (0.04 + cameraZoom * 0.013) * (0.86 + sectionEnergy * 0.14),
        0.08,
      );
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        0.58 * (0.8 + sectionEnergy * 0.18),
        0.05,
      );
    }

    const applyRepulsion = (
      points: Points | null,
      basePositions: Float32Array,
      velocity: Float32Array,
      radius: number,
      strength: number,
      returnStrength: number,
      damping: number,
      depthInfluence: number,
    ) => {
      if (!points) {
        return false;
      }

      const positionAttribute = points.geometry.attributes
        .position as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;
      const radiusSq = radius * radius;
      let hasMovement = false;

      for (let index = 0; index < positions.length; index += 3) {
        const baseX = basePositions[index];
        const baseY = basePositions[index + 1];
        const baseZ = basePositions[index + 2];
        let currentX = positions[index];
        let currentY = positions[index + 1];
        let currentZ = positions[index + 2];
        let velocityX = velocity[index];
        let velocityY = velocity[index + 1];
        let velocityZ = velocity[index + 2];

        if (interactionActive) {
          const deltaX = currentX - cursorLocal.x;
          const deltaY = currentY - cursorLocal.y * depthInfluence;
          const deltaZ = currentZ - cursorLocal.z;
          const distanceSq =
            deltaX * deltaX + deltaY * deltaY * 0.45 + deltaZ * deltaZ;

          if (distanceSq < radiusSq) {
            const distance = Math.sqrt(distanceSq) || 0.0001;
            const falloff = 1 - distance / radius;
            const impulse = falloff * strength;
            velocityX += (deltaX / distance) * impulse;
            velocityY += (deltaY / distance) * impulse * 0.32;
            velocityZ += (deltaZ / distance) * impulse;
          }
        }

        velocityX += (baseX - currentX) * returnStrength;
        velocityY += (baseY - currentY) * returnStrength;
        velocityZ += (baseZ - currentZ) * returnStrength;

        velocityX *= damping;
        velocityY *= damping;
        velocityZ *= damping;

        currentX += velocityX;
        currentY += velocityY;
        currentZ += velocityZ;

        positions[index] = currentX;
        positions[index + 1] = currentY;
        positions[index + 2] = currentZ;
        velocity[index] = velocityX;
        velocity[index + 1] = velocityY;
        velocity[index + 2] = velocityZ;

        if (
          Math.abs(velocityX) > 0.00045 ||
          Math.abs(velocityY) > 0.00045 ||
          Math.abs(velocityZ) > 0.00045 ||
          Math.abs(currentX - baseX) > 0.0012 ||
          Math.abs(currentY - baseY) > 0.0012 ||
          Math.abs(currentZ - baseZ) > 0.0012
        ) {
          hasMovement = true;
        }
      }

      positionAttribute.needsUpdate = true;
      return hasMovement;
    };

    pointerRaycastTimer.current += clampedDelta;
    const shouldUpdateRaycast = pointerRaycastTimer.current >= (interactionActive ? 1 / 48 : 1 / 30);

    if (interactionActive && discRef.current) {
      if (shouldUpdateRaycast) {
        planeNormal.set(0, 1, 0).applyQuaternion(
          discRef.current.getWorldQuaternion(worldQuaternion),
        );
        planePoint.setFromMatrixPosition(discRef.current.matrixWorld);
        interactionPlane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);
        pointerVector.set(pointer.x, pointer.y);
        raycaster.setFromCamera(pointerVector, state.camera);

        if (raycaster.ray.intersectPlane(interactionPlane, cursorWorld)) {
          cursorLocal.copy(cursorWorld);
          discRef.current.worldToLocal(cursorLocal);
        }

        pointerRaycastTimer.current = 0;
      }
    } else {
      cursorLocal.set(999, 999, 999);
    }

    repulsionTimer.current += clampedDelta;
    const shouldUpdateRepulsion =
      repulsionTimer.current >= (interactionActive ? 1 / 45 : 1 / 24) &&
      (interactionActive || hasParticleMomentum.current);

    if (shouldUpdateRepulsion) {
      const outerMoving = applyRepulsion(
        outerArmsRef.current,
        outerArmsBasePositions,
        outerArmsVelocity,
        1.9,
        0.048,
        0.018,
        0.84,
        0.5,
      );
      const dustMoving = applyRepulsion(
        dustRef.current,
        dustBasePositions,
        dustVelocity,
        1.65,
        0.032,
        0.014,
        0.82,
        0.42,
      );
      const frontDustMoving = applyRepulsion(
        frontDustRef.current,
        dustBasePositions,
        frontDustVelocity,
        1.85,
        0.038,
        0.015,
        0.8,
        0.48,
      );

      hasParticleMomentum.current =
        interactionActive || outerMoving || dustMoving || frontDustMoving;
      repulsionTimer.current = 0;
    }
  });

  return (
    <>
      <group ref={starfieldRef}>
        <SpritePoints
          pointSprite={pointSprite}
          pointRef={starsRef}
          positions={backgroundStars.positions}
          colors={backgroundStars.colors}
          size={0.042}
          opacity={0.62}
        />
      </group>

      <group
        ref={galaxyRef}
        position={[1.08, 0.04, -3]}
        rotation={[0.98, 0.14, 0.08]}
      >
        <group ref={discRef} rotation={[0.04, 0, 0]}>
          <group ref={dustGroupRef} rotation={[0.12, 0, 0]} position={[0, 0, -0.18]}>
            <SpritePoints
              pointSprite={pointSprite}
              pointRef={dustRef}
              positions={dustPositions}
              colors={dustColors}
              size={0.02}
              opacity={0.1}
            />
          </group>

          <group ref={frontDustGroupRef} rotation={[-0.1, 0.08, 0]} position={[0, 0, 0.24]}>
            <SpritePoints
              pointSprite={pointSprite}
              pointRef={frontDustRef}
              positions={frontDustPositions}
              colors={dustColors}
              size={0.014}
              opacity={0.05}
            />
          </group>

          <group ref={armsGroupRef} rotation={[0.04, 0, 0]}>
          <SpritePoints
            pointSprite={pointSprite}
            pointRef={armsRef}
            positions={galaxyArms.positions}
            colors={armColors}
            size={0.034}
            opacity={0.88}
          />
          <SpritePoints
            pointSprite={pointSprite}
            pointRef={outerArmsRef}
              positions={galaxyOuterArms.positions}
              colors={outerArmColors}
              size={0.028}
              opacity={0.64}
            />
        </group>

          <group ref={bulgeGroupRef} rotation={[-0.08, 0.14, 0]} position={[0, 0, 0.12]}>
            <SpritePoints
              pointSprite={pointSprite}
              pointRef={bulgeRef}
              positions={galaxyBulge.positions}
              colors={galaxyBulge.colors}
              size={0.02}
              opacity={0.26}
            />
          </group>

          <group ref={coreGroupRef} position={[0, 0, 0.2]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.04]}>
              <planeGeometry args={[2.2, 2.2]} />
              <meshBasicMaterial
                map={glowTexture ?? undefined}
                transparent
                opacity={
                  activeSection === "hero"
                    ? 0.08
                    : activeSection === "projects" || activeSection === "timeline"
                      ? 0.02
                      : activeSection === "contact"
                        ? 0.01
                        : 0.04
                }
                color="#ffd5ee"
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            <SpritePoints
              pointSprite={pointSprite}
              pointRef={coreRef}
              positions={galaxyCore.positions}
              colors={galaxyCore.colors}
              size={0.044}
              opacity={0.58}
            />
          </group>
        </group>
      </group>
    </>
  );
}
