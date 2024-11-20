/** Simplify a type signature to help with readability in editor hints, error messages etc */
export type Simplify<T> = { [Key in keyof T]: T[Key] } & {};

/**
 * Create a new type with the properties of the first type merged with the properties of the second type.
 * If a key exists in both types, the property from the *second* type will be used.
 */
export type MergeRight<T1, T2> = Simplify<Omit<T1, keyof T2> & T2>;
