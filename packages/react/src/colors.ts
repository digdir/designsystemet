// EmptyObject implementation from https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts
declare const emptyObjectSymbol: unique symbol;
type EmptyObject = { [emptyObjectSymbol]?: never };

/**
 * Base interface for available colors in Designsystemet.
 * The CLI will generate augmentations of this interface to allow
 * type safety of custom color names.
 */

// biome-ignore lint/suspicious/noEmptyInterface: used for interface augmentation
export interface ReactColors {}
// biome-ignore lint/suspicious/noEmptyInterface: used for interface augmentation
export interface ReactSeverityColors {}

/**
 * If {@link ReactColors} or {@link ReactSeverityColors} has been extended to include color names, return T,
 * otherwise return the arbitrary string type.
 */
type ColorWithFallback<T> = ReactColors extends EmptyObject ? string : T;

export type SeverityColors = ColorWithFallback<keyof ReactSeverityColors>;
export type Color = ColorWithFallback<keyof ReactColors>;
