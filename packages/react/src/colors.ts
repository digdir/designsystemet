/**
 * Base interface for available colors in the design system.
 * The CLI will generate augmentations of this interface to allow
 * type safety of custom color names.
 */

// biome-ignore lint/suspicious/noEmptyInterface: used for interface augmentation
export interface MainAndSupportColors {}

export type SeverityColors = 'info' | 'success' | 'warning' | 'danger';

export type CustomColors = 'neutral' | keyof MainAndSupportColors;

export type Color = CustomColors | SeverityColors;
