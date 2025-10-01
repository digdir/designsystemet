/* This file is deprecated and will be removed in a future release. Use types.d.ts instead */
/* build: v1.6.0 */
import type {} from '@digdir/designsystemet/types';

// Augment types based on theme
declare module '@digdir/designsystemet/types' {
  export interface ColorDefinitions {
    dominant: never;
    complimentary: never;
    first: never;
    second: never;
    third: never;
    fourth: never;
    neutral: never;
  }
  export interface SeverityColorDefinitions {
    info: never;
    success: never;
    warning: never;
    danger: never;
  }
}
