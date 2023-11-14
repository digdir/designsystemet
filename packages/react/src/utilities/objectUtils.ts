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

// https://github.com/ramda/ramda/blob/master/source/omit.js
type UnknownRecord = Record<string | number | symbol, unknown>;

/**
 * Returns a partial copy of an object omitting the keys specified.
 * @param {Array} names an array of String property names to omit from the new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with properties from `names` not on it.
 * @example omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
 */
export const omit = (names: string[], obj: UnknownRecord): object => {
  const result: UnknownRecord = {};
  const index: UnknownRecord = {};
  let idx = 0;
  const len = names.length;

  while (idx < len) {
    index[names[idx]] = 1;
    idx += 1;
  }

  for (const prop in obj) {
    if (!Object.prototype.hasOwnProperty.call(index, prop)) {
      result[prop] = obj[prop];
    }
  }
  return result;
};
