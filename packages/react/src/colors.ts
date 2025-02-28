// EmptyObject implementation from https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts
declare const emptyObjectSymbol: unique symbol;
type EmptyObject = { [emptyObjectSymbol]?: never };

/**
 * Base interface for available colors in the design system.
 * The CLI will generate augmentations of this interface to allow
 * type safety of custom color names.
 */

// biome-ignore lint/suspicious/noEmptyInterface: used for interface augmentation
export interface MainAndSupportColors {}

/**
 * If {@link MainAndSupportColors} has been extended to include color names, return T,
 * otherwise return the arbitrary string type.
 */
type ColorWithFallback<T> = MainAndSupportColors extends EmptyObject
  ? string
  : T;

export type SeverityInfo = 'info';
export type SeveritySuccess = 'success';
export type SeverityWarning = 'warning';
export type SeverityDanger = 'danger';
export type SeverityColors =
  | SeverityInfo
  | SeveritySuccess
  | SeverityWarning
  | SeverityDanger;

export type Color = ColorWithFallback<'neutral' | keyof MainAndSupportColors>;
