// Checks if content of arrays is equal
export function arraysEqual<T>(array1?: T[], array2?: T[]): boolean {
  if (array1 === array2) return true;
  if (array1 === undefined || array2 === undefined) return false;
  if (array1.length !== array2.length) return false;
  for (const [i] of array1.entries()) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
}

// Returns the last item of the array or undefined if the array is empty
export function lastItem<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

// Returns true if all items in the array are unique and false otherwise
export function areItemsUnique<T>(array: T[]): boolean {
  return array.length === new Set(array).size;
}
