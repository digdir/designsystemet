// This file defines public types used in the Designsystemet

// EmptyObject implementation from https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts
declare const emptyObjectSymbol: unique symbol;
type EmptyObject = { [emptyObjectSymbol]?: never };

/**
 * Base interface for available colors in Designsystemet.
 * The CLI will generate augmentations of this interface to allow
 * type safety of custom color names.
 */

// biome-ignore lint/suspicious/noEmptyInterface: used for interface augmentation
export interface ColorDefinitions {}
// biome-ignore lint/suspicious/noEmptyInterface: used for interface augmentation
export interface SeverityColorDefinitions {}

/**
 * If {@link ColorDefinitions} or {@link SeverityColorDefinitions} has been extended to include color names, return T,
 * otherwise return the arbitrary string type.
 */
type ColorWithFallback<T> = ColorDefinitions extends EmptyObject ? string : T;

/**
 * Represents the available severity colors for the Designsystemet variables.
 * These are predefined colors that can be used to indicate different levels of severity.
 *  - `'info'`: Use the info color.
 *  - `'success'`: Use the success color.
 *  - `'warning'`: Use the warning color.
 *  - `'danger'`: Use the danger color.
 */
export type SeverityColors = ColorWithFallback<keyof SeverityColorDefinitions>;
/**
 * Represents the available color options for the Designsystemet variables.
 *
 * These are augmented based on your theme configuration.
 *
 * Consist of both main and support colors
 * @link https://theme.designsystemet.no
 */
export type Color = ColorWithFallback<keyof ColorDefinitions>;
/**
 * Represents the recommended size options for the Designsystemet variables.
 * - `'sm'`: Use the small size.
 * - `'md'`: Use the medium size.
 * - `'lg'`: Use the large size.
 */
export type Size = 'sm' | 'md' | 'lg';
/**
 * Represents the available color scheme options for the Designsystemet variables.
 * - `'light'`: Use the light color scheme.
 * - `'dark'`: Use the dark color scheme.
 * - `'auto'`: Automatically select the color scheme based on system preferences.
 */
export type ColorScheme = 'light' | 'dark' | 'auto';
