/**
 * Clamps a number within the inclusive lower and upper bounds.
 *
 * @param value The number to clamp.
 * @param min The lower bound.
 * @param max The upper bound.
 * @returns The clamped number.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
