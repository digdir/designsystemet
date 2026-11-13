export type {
  /** @deprecated This export is deprecated. Use `Size` from `@digdir/designsystemet-types` */
  Size,
} from '@digdir/designsystemet-types';
export * from './components';
export { omit } from './components/Combobox/omit/omit'; // @deprecated v2
export type { DefaultProps, LabelRequired, Placement } from './types';
export type {
  /** @deprecated v2 This export is deprecated. */
  MergeRight,
  UseCheckboxGroupProps,
  UsePaginationProps,
  UseRadioGroupProps,
} from './utilities';
export {
  /** @deprecated v2 This export is deprecated. Use focusgroup attribute instead */
  RovingFocusItem,
  /** @deprecated v2 This export is deprecated. Use focusgroup attribute instead */
  RovingFocusRoot,
  useCheckboxGroup,
  /** @deprecated v2 This export is deprecated. Use utility libraries or create your own utility function. */
  useDebounceCallback,
  /** @deprecated v2 This export is deprecated. Use utility libraries or create your own utility function. */
  useIsomorphicLayoutEffect,
  /** @deprecated v2 This export is deprecated. Use utility libraries or create your own utility function. */
  useMediaQuery,
  usePagination,
  useRadioGroup,
  /** @deprecated v2 This export is deprecated. Use utility libraries or create your own utility function. */
  useSynchronizedAnimation,
} from './utilities';
