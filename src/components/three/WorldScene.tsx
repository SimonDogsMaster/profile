"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group, Points, Texture } from "three";
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

function createAmbientStarField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const amplitudes = new Float32Array(count);
  const highlights = new Float32Array(count);
  const temperatures = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    positions[stride] = (Math.random() - 0.5) * 90;
    positions[stride + 1] = (Math.random() - 0.5) * 52;
    positions[stride + 2] = -20 - Math.random() * 110;

    const brightness = 0.45 + Math.random() * 0.55;
    colors[stride] = brightness;
    colors[stride + 1] = brightness * 0.98;
    colors[stride + 2] = brightness;
    phases[index] = Math.random() * Math.PI * 2;
    amplitudes[index] = 0.18 + Math.random() * 0.4;
    highlights[index] = Math.random() > 0.92 ? 1 : 0;
    temperatures[index] = Math.random();
  }

  return { positions, colors, phases, amplitudes, highlights, temperatures };
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
  if (!ref.current || Math.abs(speed) <= 0.0001) {
    return;
  }

  const positionAttribute = ref.current.geometry.attributes.position as THREE.BufferAttribute;
  const values = positionAttribute.array as Float32Array;
  const behindZ = -depth - 24;

  for (let index = 0; index < values.length; index += 3) {
    values[index + 2] += speed * delta * 18;

    if (values[index + 2] > exitZ) {
      resetTunnelStar(values, index, radius, depth);
    } else if (values[index + 2] < behindZ) {
      const point = randomTunnelPoint(radius, depth);
      values[index] = point.x;
      values[index + 1] = point.y;
      values[index + 2] = exitZ + Math.random() * 8;
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
  const ambientStarsRef = useRef<Points>(null);
  const ambientStarsFarRef = useRef<Points>(null);
  const galaxyRef = useRef<Group>(null);
  const starfieldRef = useRef<Group>(null);
  const tunnelEnergyRef = useRef(0);
  const tunnelDirectionRef = useRef(1);
  const previousScrollVelocityRef = useRef(0);
  const previousScrollProgressRef = useRef(0);
  const warpDriveRef = useRef(0);
  const forwardWarpRef = useRef(0);
  const warpKickRef = useRef(0);
  const galaxyPulseRef = useRef(0);
  const galaxyApproachRef = useRef(0);

  const ambientStars = useMemo(() => createAmbientStarField(360), []);
  const ambientStarsFar = useMemo(() => createAmbientStarField(240), []);
  const farPositions = useMemo(() => createTunnelPositions(900, 26, TUNNEL_DEPTH), []);
  const midPositions = useMemo(() => createTunnelPositions(560, 18, TUNNEL_DEPTH), []);
  const nearPositions = useMemo(() => createTunnelPositions(420, 12, TUNNEL_DEPTH), []);
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
    const signedScrollAcceleration = scrollVelocity - previousScrollVelocityRef.current;
    const scrollAcceleration = Math.abs(signedScrollAcceleration);
    previousScrollVelocityRef.current = scrollVelocity;
    const scrollProgressDelta = scrollProgress - previousScrollProgressRef.current;
    previousScrollProgressRef.current = scrollProgress;

    const signedWarpTarget = reducedMotion
      ? 0
      : scrollVelocity > 0.008
        ? THREE.MathUtils.clamp(scrollVelocity / 0.42, 0, 1.85)
        : scrollVelocity < -0.008
          ? -THREE.MathUtils.clamp(-scrollVelocity / 0.52, 0, 1.3)
          : 0;
    const warpDriveSmoothing = signedWarpTarget === 0 ? 0.11 : 0.24;
    warpDriveRef.current = THREE.MathUtils.lerp(
      warpDriveRef.current,
      signedWarpTarget,
      warpDriveSmoothing
    );
    if (Math.abs(warpDriveRef.current) < 0.01) {
      warpDriveRef.current = 0;
    }

    const signedWarpDrive = warpDriveRef.current;
    const warpDirection: -1 | 0 | 1 =
      signedWarpDrive > 0.04 ? 1 : signedWarpDrive < -0.04 ? -1 : 0;
    const warpMode = warpDirection === 1 ? "forward" : warpDirection === -1 ? "reverse" : "settle";
    const forwardDrive = Math.max(0, signedWarpDrive);
    const reverseDrive = Math.max(0, -signedWarpDrive);
    const tunnelImpulse = reducedMotion
      ? 0
      : THREE.MathUtils.clamp(
          Math.abs(signedWarpDrive) * 1.18 + Math.abs(scrollVelocity) * 1.8 + scrollAcceleration * 2.4,
          0,
          1.8
        );
    if (tunnelImpulse > 0.03 && warpDirection !== 0) {
      tunnelDirectionRef.current = warpDirection;
      tunnelEnergyRef.current = Math.max(
        tunnelEnergyRef.current,
        THREE.MathUtils.lerp(0.3, warpDirection > 0 ? 1.34 : 1.02, tunnelImpulse / 1.8)
      );
    } else {
      tunnelEnergyRef.current *= 0.88;
      if (tunnelEnergyRef.current < 0.01) {
        tunnelEnergyRef.current = 0;
      }
    }

    const tunnelEnergy = tunnelEnergyRef.current;
    const tunnelSpeed =
      tunnelDirectionRef.current >= 0
        ? tunnelEnergy
        : -tunnelEnergy * 0.62;
    const warpDrive = forwardDrive > 0 ? forwardDrive : reverseDrive;
    const warpKick = reducedMotion
      ? 0
      : THREE.MathUtils.clamp(Math.abs(signedScrollAcceleration) * 8.8, 0, 1.1);

    if (warpDrive > 0.02) {
      forwardWarpRef.current = Math.max(
        forwardWarpRef.current,
        THREE.MathUtils.lerp(0.22, warpDirection > 0 ? 1.12 : 0.88, Math.min(1, warpDrive / 1.2))
      );
    } else {
      forwardWarpRef.current *= 0.84;
      if (forwardWarpRef.current < 0.01) {
        forwardWarpRef.current = 0;
      }
    }

    if (warpKick > 0.01 && warpDirection !== 0) {
      warpKickRef.current = Math.max(warpKickRef.current, warpKick);
    } else {
      warpKickRef.current *= 0.76;
      if (warpKickRef.current < 0.01) {
        warpKickRef.current = 0;
      }
    }

    const forwardWarp = forwardWarpRef.current;
    const warpKickEnergy = warpKickRef.current;
    const galaxyApproach = forwardWarp * 1.04 + warpKickEnergy * 0.42 + forwardDrive * 0.2;
    const galaxyRetreat = reverseDrive * 0.58;
    const pulsePhase = ((scrollProgress * 2.4) % 1 + 1) % 1;
    const distancePulse =
      reducedMotion || warpDirection === 0
        ? 0
        : Math.pow(Math.sin(pulsePhase * Math.PI), 1.55) *
          THREE.MathUtils.clamp(warpDrive / 0.9, 0, 1) *
          (warpDirection > 0 ? 0.86 : 0.52);
    if (warpDirection !== 0 && distancePulse > 0.02) {
      galaxyPulseRef.current = distancePulse;
    } else if (warpKick > 0.02) {
      galaxyPulseRef.current = Math.max(galaxyPulseRef.current, 0.18 + warpKick * 0.42);
    } else if (distancePulse > 0.02) {
      galaxyPulseRef.current = Math.max(galaxyPulseRef.current * 0.9, distancePulse);
    } else {
      galaxyPulseRef.current *= warpMode === "settle" ? 0.68 : 0.82;
      if (galaxyPulseRef.current < 0.01) {
        galaxyPulseRef.current = 0;
      }
    }

    const galaxyPulse = galaxyPulseRef.current;
    const dollyImpulse = reducedMotion ? 0 : Math.min(Math.abs(scrollVelocity) * 0.56, 0.4);
    const forwardTravel = reducedMotion ? 0 : scrollProgress * 1.22;
    const rawApproachProgress = THREE.MathUtils.clamp(scrollProgress / 6, 0, 1.3);

    if (reducedMotion) {
      galaxyApproachRef.current = rawApproachProgress;
    } else if (scrollProgressDelta > 0.0008) {
      galaxyApproachRef.current +=
        scrollProgressDelta * 0.72 +
        forwardDrive * delta * 0.9 +
        Math.max(0, signedScrollAcceleration) * delta * 0.16;
      galaxyApproachRef.current = Math.max(galaxyApproachRef.current, rawApproachProgress);
    } else if (scrollProgressDelta < -0.0008 || warpDirection < 0) {
      galaxyApproachRef.current = THREE.MathUtils.lerp(
        galaxyApproachRef.current,
        Math.max(0, rawApproachProgress - reverseDrive * 0.28),
        0.18
      );
    } else {
      galaxyApproachRef.current = Math.max(galaxyApproachRef.current * 0.9992, rawApproachProgress);
    }

    galaxyApproachRef.current = THREE.MathUtils.clamp(galaxyApproachRef.current, 0, 2.2);
    const galaxyApproachProgress = galaxyApproachRef.current;

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
      target.cameraZ -
        forwardTravel -
        dollyImpulse -
        (warpDirection > 0 ? forwardWarp * 0.94 + warpKickEnergy * 0.34 + forwardDrive * 0.42 : 0) +
        (warpDirection < 0 ? reverseDrive * 0.28 : 0),
      warpDirection !== 0 ? 0.065 : 0.045
    );
    state.camera.lookAt(
      target.coreX * 0.72,
      target.coreY * 0.4,
      -58.8 -
        forwardTravel * 3.2 -
        (warpDirection > 0 ? forwardWarp * 11.8 + warpKickEnergy * 3.8 + forwardDrive * 4.8 : 0) +
        (warpDirection < 0 ? reverseDrive * 2.8 : 0)
    );

    if (starfieldRef.current) {
      starfieldRef.current.rotation.z = THREE.MathUtils.lerp(
        starfieldRef.current.rotation.z,
        reducedMotion ? 0 : pointer.x * 0.018 + (warpDirection > 0 ? forwardWarp * 0.006 : -reverseDrive * 0.004),
        0.03
      );
      starfieldRef.current.rotation.x = THREE.MathUtils.lerp(
        starfieldRef.current.rotation.x,
        reducedMotion ? 0 : pointer.y * 0.014 - (warpDirection > 0 ? forwardWarp * 0.004 : -reverseDrive * 0.002),
        0.03
      );
    }

    updateTunnel(tunnelFarRef, 26, TUNNEL_DEPTH, tunnelSpeed * 0.38, delta, 16);
    updateTunnel(tunnelMidRef, 18, TUNNEL_DEPTH, tunnelSpeed * 0.78, delta, 18);
    updateTunnel(tunnelNearRef, 12, TUNNEL_DEPTH, tunnelSpeed * 1.45, delta, 22);

    tuneTunnelMaterial(tunnelFarRef, 0.045 + tunnelEnergy * 0.024, 0.018 + tunnelEnergy * 0.0015);
    tuneTunnelMaterial(tunnelMidRef, 0.075 + tunnelEnergy * 0.045, 0.024 + tunnelEnergy * 0.005);
    tuneTunnelMaterial(tunnelNearRef, 0.1 + tunnelEnergy * 0.08, 0.03 + tunnelEnergy * 0.016);

    if (ambientStarsRef.current) {
      const material = ambientStarsRef.current.material as THREE.PointsMaterial;
      const colorAttribute = ambientStarsRef.current.geometry.attributes.color as THREE.BufferAttribute;
      const values = colorAttribute.array as Float32Array;

      for (let index = 0; index < ambientStars.phases.length; index += 1) {
        const stride = index * 3;
        const twinkle =
          0.46 +
          Math.sin(time * (0.6 + ambientStars.amplitudes[index]) + ambientStars.phases[index]) *
            ambientStars.amplitudes[index] *
            0.38 +
          Math.sin(time * 1.9 + ambientStars.phases[index] * 0.7) * 0.08;

        const burst =
          ambientStars.highlights[index] > 0
            ? Math.pow(
                Math.max(0, Math.sin(time * 2.8 + ambientStars.phases[index] * 1.2)),
                7
              ) * 0.7
            : 0;
        const brightness = THREE.MathUtils.clamp(twinkle + burst, 0.2, 1.2);
        const temp = ambientStars.temperatures[index];
        const warmMix = temp * 0.22;
        const coolMix = (1 - temp) * 0.16;
        values[stride] = brightness * (1 + warmMix * 0.08);
        values[stride + 1] = brightness * (0.985 + warmMix * 0.02);
        values[stride + 2] = brightness * (1 + coolMix * 0.18);
      }

      colorAttribute.needsUpdate = true;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.16, 0.04);
      material.size = THREE.MathUtils.lerp(material.size, 0.052, 0.04);
    }

    if (ambientStarsFarRef.current) {
      const material = ambientStarsFarRef.current.material as THREE.PointsMaterial;
      const colorAttribute = ambientStarsFarRef.current.geometry.attributes.color as THREE.BufferAttribute;
      const values = colorAttribute.array as Float32Array;

      for (let index = 0; index < ambientStarsFar.phases.length; index += 1) {
        const stride = index * 3;
        const twinkle =
          0.32 +
          Math.sin(time * (0.42 + ambientStarsFar.amplitudes[index] * 0.6) + ambientStarsFar.phases[index]) *
            ambientStarsFar.amplitudes[index] *
            0.24;
        const burst =
          ambientStarsFar.highlights[index] > 0
            ? Math.pow(
                Math.max(0, Math.sin(time * 1.9 + ambientStarsFar.phases[index])),
                8
              ) * 0.34
            : 0;
        const brightness = THREE.MathUtils.clamp(twinkle + burst, 0.12, 0.78);
        const temp = ambientStarsFar.temperatures[index];
        const coolBias = 0.18 + (1 - temp) * 0.22;
        values[stride] = brightness * 0.92;
        values[stride + 1] = brightness * 0.97;
        values[stride + 2] = brightness * (1 + coolBias * 0.22);
      }

      colorAttribute.needsUpdate = true;
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0.09, 0.04);
      material.size = THREE.MathUtils.lerp(material.size, 0.036, 0.04);
    }

    if (galaxyRef.current) {
      const deepApproach = Math.pow(THREE.MathUtils.clamp(galaxyApproachProgress / 2.1, 0, 1), 0.9);
      const baseScale = THREE.MathUtils.lerp(1.12, 3.4, deepApproach);
      const scaleBoost = reducedMotion
        ? 0
        : deepApproach * 0.62 +
          galaxyApproachProgress * 0.22 +
          forwardDrive * 0.92 +
          forwardWarp * 0.4 +
          tunnelEnergy * 0.16 +
          galaxyPulse * (warpDirection > 0 ? 0.54 : 0.24) +
          warpKickEnergy * 0.12 -
          galaxyRetreat * 0.2;
      const targetScale = baseScale * (1 + scaleBoost);
      const scale = THREE.MathUtils.lerp(
        galaxyRef.current.scale.x,
        targetScale,
        forwardDrive > 0.04 || reverseDrive > 0.04 ? 0.2 : 0.09
      );
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
        22 +
          scrollProgress * 2.6 +
          deepApproach * 20 +
          galaxyApproachProgress * 12 +
          galaxyApproach * 6 +
          forwardDrive * 3.6 +
          galaxyPulse * 1.1 -
          galaxyRetreat * 1.2,
        forwardDrive > 0.04 || reverseDrive > 0.04 ? 0.18 : 0.09
      );
    }

  });

  return (
    <group ref={starfieldRef}>
      <SpritePoints
        pointSprite={pointSprite}
        pointRef={ambientStarsRef}
        positions={ambientStars.positions}
        colors={ambientStars.colors}
        size={0.052}
        opacity={0.16}
      />

      <group position={[0, 0, -26]}>
        <SpritePoints
          pointSprite={pointSprite}
          pointRef={ambientStarsFarRef}
          positions={ambientStarsFar.positions}
          colors={ambientStarsFar.colors}
          size={0.036}
          opacity={0.09}
        />
      </group>

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

    </group>
  );
}
