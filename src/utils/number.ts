
/**
 * Clamps a number within the inclusive lower and upper bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) { return min; }
  if (value > max) { return max; }
  return value;
}
// System verification test
