import type { RefObject } from "react";
import type { LineSegments, Points } from "three";
import * as THREE from "three";

export type StreakInstance = {
  active: boolean;
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  z: number;
  length: number;
  speed: number;
  drag: number;
  drift: number;
  age: number;
  seed: number;
  direction: 1 | -1;
  opacity: number;
  spread: number;
};

export type StreakEmitOptions = {
  depth: number;
  direction: 1 | -1;
  impulse: number;
  focusX: number;
  focusY: number;
  pointerX: number;
  pointerY: number;
  scrollVelocity: number;
  sectionProgress: number;
};

export const STREAK_POOL_SIZE = 168;
export const STREAK_RADIUS = 11;

const STREAK_FORWARD_EXIT_Z = 30;
const STREAK_LINE_COLOR = new THREE.Color("#dff4ff");
const STREAK_GLOW_COLOR = new THREE.Color("#f7fcff");

function randomTunnelPoint(radius: number, depth: number) {
  const angle = Math.random() * Math.PI * 2;
  const ring = Math.pow(Math.random(), 0.62) * radius;

  return {
    x: Math.cos(angle) * ring,
    y: Math.sin(angle) * ring * 0.6,
    z: -Math.random() * depth
  };
}

function createSpawnPoint(
  radius: number,
  depth: number,
  direction: 1 | -1,
  impulse: number,
  focusX: number,
  focusY: number,
  pointerX: number,
  pointerY: number,
  sectionProgress: number
) {
  const base = randomTunnelPoint(radius * (0.28 + impulse * 0.08), depth);
  const laneBias = THREE.MathUtils.clamp(focusX + pointerX * 1.45 + direction * 0.28, -1.8, 1.8);
  const verticalBias = THREE.MathUtils.clamp(focusY + pointerY * -0.55, -0.9, 0.9);
  const focus = THREE.MathUtils.lerp(0.72, 0.52, sectionProgress);

  return {
    x: THREE.MathUtils.clamp(THREE.MathUtils.lerp(base.x, laneBias, focus), -3.8, 3.8),
    y: THREE.MathUtils.clamp(THREE.MathUtils.lerp(base.y, verticalBias, focus + 0.1), -2.1, 2.1),
    z: base.z
  };
}

function createParkedPointPositions(count: number, depth: number) {
  const values = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3;
    values[stride] = 0;
    values[stride + 1] = 0;
    values[stride + 2] = -depth - 60;
  }

  return values;
}

function createParkedSegmentPositions(count: number, depth: number) {
  const values = new Float32Array(count * 6);

  for (let index = 0; index < count; index += 1) {
    const stride = index * 6;
    values[stride] = 0;
    values[stride + 1] = 0;
    values[stride + 2] = -depth - 60;
    values[stride + 3] = 0;
    values[stride + 4] = 0;
    values[stride + 5] = -depth - 68;
  }

  return values;
}

function createEmptyStreak(depth: number): StreakInstance {
  return {
    active: false,
    anchorX: 0,
    anchorY: 0,
    x: 0,
    y: 0,
    z: -depth - 60,
    length: 0,
    speed: 0,
    drag: 0,
    drift: 0,
    age: 0,
    seed: 0,
    direction: 1,
    opacity: 0,
    spread: 0
  };
}

function getBlurAmount(streak: StreakInstance) {
  return streak.direction > 0
    ? THREE.MathUtils.clamp((streak.speed - 0.3) / 1.55, 0, 1)
    : THREE.MathUtils.clamp((streak.speed - 0.72) / 1.45, 0, 1);
}

function getRenderedLength(streak: StreakInstance) {
  const minLength = streak.direction > 0 ? 1.15 : 0.14;
  const curve = streak.direction > 0 ? 0.54 : 0.82;
  return THREE.MathUtils.lerp(minLength, streak.length, Math.pow(getBlurAmount(streak), curve));
}

function getStreakTailZ(streak: StreakInstance) {
  return streak.z - getRenderedLength(streak) * streak.direction;
}

function writeColorTriplet(
  values: Float32Array,
  stride: number,
  color: THREE.Color,
  intensity: number
) {
  values[stride] = color.r * intensity;
  values[stride + 1] = color.g * intensity;
  values[stride + 2] = color.b * intensity;
}

function writeLineColor(
  values: Float32Array,
  stride: number,
  color: THREE.Color,
  headIntensity: number,
  tailIntensity: number
) {
  writeColorTriplet(values, stride, color, headIntensity);
  writeColorTriplet(values, stride + 3, color, tailIntensity);
}

function writeStreakSegment(
  values: Float32Array,
  stride: number,
  streak: StreakInstance
) {
  const tailZ = getStreakTailZ(streak);
  values[stride] = streak.x;
  values[stride + 1] = streak.y;
  values[stride + 2] = streak.z;
  values[stride + 3] = streak.x;
  values[stride + 4] = streak.y;
  values[stride + 5] = tailZ;
}

function parkStreakGeometry(
  pointPositions: Float32Array,
  pointColors: Float32Array,
  linePositions: Float32Array,
  lineColors: Float32Array,
  index: number,
  depth: number
) {
  const headPointStride = index * 6;
  const tailPointStride = headPointStride + 3;
  const lineStride = index * 6;

  pointPositions[headPointStride] = 0;
  pointPositions[headPointStride + 1] = 0;
  pointPositions[headPointStride + 2] = -depth - 60;
  pointPositions[tailPointStride] = 0;
  pointPositions[tailPointStride + 1] = 0;
  pointPositions[tailPointStride + 2] = -depth - 64;
  pointColors[headPointStride] = 0;
  pointColors[headPointStride + 1] = 0;
  pointColors[headPointStride + 2] = 0;
  pointColors[tailPointStride] = 0;
  pointColors[tailPointStride + 1] = 0;
  pointColors[tailPointStride + 2] = 0;

  linePositions[lineStride] = 0;
  linePositions[lineStride + 1] = 0;
  linePositions[lineStride + 2] = -depth - 60;
  linePositions[lineStride + 3] = 0;
  linePositions[lineStride + 4] = 0;
  linePositions[lineStride + 5] = -depth - 68;
  lineColors[lineStride] = 0;
  lineColors[lineStride + 1] = 0;
  lineColors[lineStride + 2] = 0;
  lineColors[lineStride + 3] = 0;
  lineColors[lineStride + 4] = 0;
  lineColors[lineStride + 5] = 0;
}

function getStreakOpacity(streak: StreakInstance, depth: number) {
  const reverseExitZ = -depth - 24;
  const fadeIn =
    streak.direction > 0
      ? THREE.MathUtils.smoothstep(streak.z, -depth * 0.78, -depth * 0.36)
      : 1 - THREE.MathUtils.smoothstep(streak.z, 12, 34);
  const fadeOut =
    streak.direction > 0
      ? 1 - THREE.MathUtils.smoothstep(streak.z, STREAK_FORWARD_EXIT_Z - 10, STREAK_FORWARD_EXIT_Z + 6)
      : THREE.MathUtils.smoothstep(streak.z, reverseExitZ, -depth + 8);
  const speedFactor = THREE.MathUtils.clamp((streak.speed - 0.8) / 2.8, 0.28, 1);
  const agePulse = 0.82 + Math.sin(streak.age * 5.8 + streak.seed) * 0.06;

  return fadeIn * fadeOut * agePulse * (0.4 + speedFactor * 0.6);
}

export function createStreakPool(count: number, depth: number) {
  return Array.from({ length: count }, () => createEmptyStreak(depth));
}

export function createStreakGeometry(count: number, depth: number) {
  return {
    pointPositions: createParkedPointPositions(count * 2, depth),
    pointColors: new Float32Array(count * 2 * 3),
    linePositions: createParkedSegmentPositions(count, depth),
    lineColors: new Float32Array(count * 6)
  };
}

export function emitStreak(
  streaks: StreakInstance[],
  cursor: number,
  radius: number,
  options: StreakEmitOptions
) {
  let targetIndex = -1;

  for (let offset = 0; offset < streaks.length; offset += 1) {
    const index = (cursor + offset) % streaks.length;
    if (!streaks[index].active) {
      targetIndex = index;
      break;
    }
  }

  if (targetIndex === -1) {
    targetIndex = cursor % streaks.length;
  }

  const { depth, direction, impulse, focusX, focusY, pointerX, pointerY, scrollVelocity, sectionProgress } = options;
  const point = createSpawnPoint(
    radius,
    depth,
    direction,
    impulse,
    focusX,
    focusY,
    pointerX,
    pointerY,
    sectionProgress
  );
  const scrollWeight = THREE.MathUtils.clamp(Math.abs(scrollVelocity) / 0.9, 0, 1);
  const speedBase = direction > 0 ? 3.6 : 0.82;
  const speedRange = direction > 0 ? 3.8 : 0.92;
  const lengthBase = direction > 0 ? 8.5 : 1.2;
  const lengthRange = direction > 0 ? 10.5 : 1.6;
  const speed = speedBase + impulse * speedRange + scrollWeight * 0.4 + Math.random() * 0.22;

  streaks[targetIndex] = {
    active: true,
    anchorX: point.x,
    anchorY: point.y,
    x: point.x,
    y: point.y,
    z:
      direction > 0
        ? -depth * (0.66 + Math.random() * 0.16)
        : STREAK_FORWARD_EXIT_Z + Math.random() * 8,
    length: lengthBase + impulse * lengthRange + scrollWeight * 0.75 + Math.random() * 0.8,
    speed,
    drag: (direction > 0 ? 0.14 : 0.78) + Math.random() * 0.08,
    drift: (Math.random() - 0.5) * (direction > 0 ? 0.035 : 0.03),
    age: 0,
    seed: Math.random() * Math.PI * 2,
    direction,
    opacity: 0,
    spread: THREE.MathUtils.lerp(0.18, direction > 0 ? 1.15 : 0.62, impulse) + scrollWeight * 0.24
  };

  return (targetIndex + 1) % streaks.length;
}

export function syncStreakPool(
  streaks: StreakInstance[],
  pointRef: RefObject<Points | null>,
  lineRef: RefObject<LineSegments | null>,
  depth: number,
  delta: number,
  time: number,
  settle: number
) {
  if (!pointRef.current || !lineRef.current) {
    return 0;
  }

  const pointPositionAttribute = pointRef.current.geometry.attributes.position as THREE.BufferAttribute;
  const pointColorAttribute = pointRef.current.geometry.attributes.color as THREE.BufferAttribute;
  const linePositionAttribute = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
  const lineColorAttribute = lineRef.current.geometry.attributes.color as THREE.BufferAttribute;
  const pointPositions = pointPositionAttribute.array as Float32Array;
  const pointColors = pointColorAttribute.array as Float32Array;
  const linePositions = linePositionAttribute.array as Float32Array;
  const lineColors = lineColorAttribute.array as Float32Array;

  let activeCount = 0;
  const reverseExitZ = -depth - 24;

  for (let index = 0; index < streaks.length; index += 1) {
    const streak = streaks[index];
    const headPointStride = index * 6;
    const tailPointStride = headPointStride + 3;
    const lineStride = index * 6;

    if (!streak.active) {
      parkStreakGeometry(pointPositions, pointColors, linePositions, lineColors, index, depth);
      continue;
    }

    streak.age += delta;
    const settleDrag = THREE.MathUtils.lerp(1, 12, settle);
    streak.speed = Math.max(0, streak.speed * (1 - delta * streak.drag * 0.16 * settleDrag));
    streak.z += streak.speed * streak.direction * delta * (streak.direction > 0 ? 26 : 18);
    const blurAmount = getBlurAmount(streak);
    const travelProgress =
      streak.direction > 0
        ? THREE.MathUtils.smoothstep(streak.z, -depth + 8, STREAK_FORWARD_EXIT_Z - 4)
        : 1 - THREE.MathUtils.smoothstep(streak.z, reverseExitZ + 4, 18);
    const warpProgress = Math.pow(travelProgress, 1.45) * streak.spread;
    const targetX = streak.anchorX + streak.anchorX * warpProgress;
    const targetY = streak.anchorY + streak.anchorY * warpProgress * 0.62;
    const sway = Math.sin(streak.age * (1.8 + streak.speed * 0.32) + streak.seed) * streak.drift;
    streak.x = THREE.MathUtils.lerp(streak.x, targetX, 0.085 + blurAmount * 0.08) + sway * delta * 4.4;
    streak.y =
      THREE.MathUtils.lerp(streak.y, targetY, 0.075 + blurAmount * 0.06) +
      Math.cos(streak.age * 1.4 + streak.seed * 0.7) * streak.drift * delta * 1.2;
    streak.x = THREE.MathUtils.clamp(streak.x, -4.4, 4.4);
    streak.y = THREE.MathUtils.clamp(streak.y, -2.4, 2.4);

    const exited =
      streak.direction > 0
        ? streak.z > STREAK_FORWARD_EXIT_Z
        : streak.z < reverseExitZ;
    const outsideCorridor = Math.abs(streak.x) > 4.2 || Math.abs(streak.y) > 2.2;

    if (exited || outsideCorridor || (settle > 0.3 && streak.speed < 0.18)) {
      streaks[index] = createEmptyStreak(depth);
      parkStreakGeometry(pointPositions, pointColors, linePositions, lineColors, index, depth);
      continue;
    }

    const shimmer = 0.92 + Math.sin(time * (5.2 + index * 0.03) + index * 0.67) * 0.08;
    const opacity = getStreakOpacity(streak, depth);
    const glowIntensity =
      streak.direction > 0
        ? opacity * (0.76 + blurAmount * 0.16 + shimmer * 0.08)
        : opacity * (0.9 + blurAmount * 0.22 + shimmer * 0.12);
    const lineHeadIntensity =
      streak.direction > 0
        ? opacity * Math.max(0.18, blurAmount * 0.84) * (0.34 + shimmer * 0.05) * (1 - settle * 0.84)
        : opacity * blurAmount * (0.3 + shimmer * 0.08) * (1 - settle * 0.78);
    const tailZ = getStreakTailZ(streak);
    const edgeFade = 1 - THREE.MathUtils.smoothstep(Math.abs(streak.x), 2.2, 4.1) * 0.48;
    const effectiveTailZ = THREE.MathUtils.lerp(streak.z, tailZ, edgeFade);
    const tailGlowMix = THREE.MathUtils.clamp(getRenderedLength(streak) / 4.8, 0.18, 0.76);
    const lineTailIntensity = lineHeadIntensity * (0.08 + tailGlowMix * 0.12);

    streak.opacity = opacity * edgeFade;

    pointPositions[headPointStride] = streak.x;
    pointPositions[headPointStride + 1] = streak.y;
    pointPositions[headPointStride + 2] = streak.z;
    writeColorTriplet(pointColors, headPointStride, STREAK_GLOW_COLOR, glowIntensity * edgeFade);

    pointPositions[tailPointStride] = streak.x;
    pointPositions[tailPointStride + 1] = streak.y;
    pointPositions[tailPointStride + 2] = THREE.MathUtils.lerp(effectiveTailZ, streak.z, 0.24);
    writeColorTriplet(pointColors, tailPointStride, STREAK_LINE_COLOR, glowIntensity * tailGlowMix * edgeFade);

    writeStreakSegment(linePositions, lineStride, streak);
    linePositions[lineStride + 5] = effectiveTailZ;
    writeLineColor(lineColors, lineStride, STREAK_LINE_COLOR, lineHeadIntensity * edgeFade, lineTailIntensity * edgeFade);
    activeCount += 1;
  }

  pointPositionAttribute.needsUpdate = true;
  pointColorAttribute.needsUpdate = true;
  linePositionAttribute.needsUpdate = true;
  lineColorAttribute.needsUpdate = true;

  return activeCount;
}
