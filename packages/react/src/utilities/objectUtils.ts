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
