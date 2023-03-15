/**
 * Applies a shallow comparison on the properties of the given objects.
 * @param object1 The first object to compare.
 * @param object2 The second object to compare.
 * @returns {boolean} True if the objects have the same properties and the values of those properties are equal.
 */
export const objectValuesEqual = <T extends Record<string, unknown>>(
  object1: T,
  object2: T,
) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) if (object1[key] !== object2[key]) return false;
  return true;
};
