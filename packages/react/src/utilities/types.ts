/** Simplify a type signature to help with readability in editor hints, error messages etc */
export type Simplify<T> = { [Key in keyof T]: T[Key] } & {};

/** Merge two types, with properties from the second overriding properties from the first */
export type Merge<T1, T2> = Simplify<Omit<T1, keyof T2> & T2>;
