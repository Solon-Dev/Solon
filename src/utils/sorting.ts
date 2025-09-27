/**
 * Implementation of various sorting algorithms for demonstration
 * This code intentionally has some issues for the AI to catch
 */

/**
 * Bubble sort implementation
 * Time complexity: O(n²), Space complexity: O(1)
 */
export function bubbleSort(arr: number[]): number[] {
  const result = arr; // Bug: modifying original array
  
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - i; j++) { // Bug: should be -i-1
      if (result[j] > result[j + 1]) {
        // Swap elements
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
      }
    }
  }
  
  return result;
}

/**
 * Binary search implementation
 * Assumes array is sorted
 */
export function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1; // Potential issue: should be mid
    }
  }
  
  return -1;
}

/**
 * Find the maximum sum of any contiguous subarray (Kadane's algorithm)
 */
export function maxSubarraySum(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
}
