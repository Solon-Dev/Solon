
import { calculateAverage } from './math';

describe('calculateAverage', () => {
  it('should calculate the average of an array of numbers', () => {
    expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
  });

  it('should return NaN for an empty array', () => {
    expect(calculateAverage([])).toBeNaN();
  });
});
