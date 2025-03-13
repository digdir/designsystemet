/**
 * Base interface for user-defined mappings from Designsystemet's internal size names
 * to user-defined sizes. This allows a downstream library consumer to augment this
 * interface to change or disable a given size.
 *
 * Why would you do this?
 *   - It lets you change the sizing scale (e.g. map all sizes one size down)
 *   - It allows you to rename the sizes as you please (e.g. "small", "medium", ...)
 *     NB: This means you would have to bring your own `data-size` styling, as renaming
 *     a size to one that doesn't already exist in Designsystemet opts out of the
 *     built-in `data-size` styling.
 * @example
 * import type {} from '@digdir/designsystemet-react/sizes';
 *
 * // This will disable '2xs' and rename 'sm' to 'small'
 * declare module '@digdir/designsystemet-react/sizes' {
 *   export interface SizeMap {
 *     '2xs': never;
 *     sm: 'small';
 *   }
 * }
 *
 */
// biome-ignore lint/suspicious/noEmptyInterface: used for interface augmentation
export interface SizeMap {}

type InternalSizeNames = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type DefaultSizeMap = {
  [K in InternalSizeNames]: K;
};

type CombinedSizeMap = Omit<DefaultSizeMap, keyof SizeMap> & SizeMap;

/** Look up the actual size names for the given internal size names */
export type GetSizes<T extends InternalSizeNames> = CombinedSizeMap[T];

export type Size = GetSizes<'sm' | 'md' | 'lg'>;

export type AllPossibleSizes = GetSizes<InternalSizeNames>;
