/**
 * Create a new type with the properties of the first type merged with the properties of the second type.
 * If a key exists in both types, the property from the *second* type will be used.
 */
export type MergeRight<T1, T2> = Omit<T1, keyof T2> & T2;
