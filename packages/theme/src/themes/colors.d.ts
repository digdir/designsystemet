/* build: v1.1.3 */
// @ts-ignore: Ignore invalid module name for augmentation
import type {} from '@digdir/designsystemet-react/colors';
interface Colors_ {
    accent: never;
    brand1: never;
    brand2: never;
    brand3: never;
    neutral: never;
}
interface SeverityColors_ {
  info: never;
  success: never;
  warning: never;
  danger: never;
}

// Types for esm module import
export type Colors = keyof Colors_;
export type SeverityColors = keyof SeverityColors_;
export type Color = Colors | SeverityColors;

// Augment types in react package based on theme
// @ts-ignore: Ignore invalid module name for augmentation
declare module '@digdir/designsystemet-react/colors' {
  export interface ReactSeverityColors extends SeverityColors_ {}
  export interface ReactColors extends Colors_ {}
}
