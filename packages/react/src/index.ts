export type {
  /** @deprecated This export is deprecated. Use `Size` from `@digdir/designsystemet-types` */
  Size,
} from '@digdir/designsystemet-types';
export type {
  PaginationOptions,
  PaginationResult,
  PaginationStep,
} from '@digdir/designsystemet-web/pagination'; // Re-export pagination-helper
export { pagination } from '@digdir/designsystemet-web/pagination'; // Re-export pagination-helper
export * from './components';
export { omit } from './components/Combobox/omit/omit'; //deprecated
export type { DefaultProps, LabelRequired, Placement } from './types';
export type {
  /** @deprecated This export is deprecated. */
  MergeRight,
  UseCheckboxGroupProps,
  /** @deprecated This export is deprecated. Use pagination utility function instead. */
  UsePaginationProps,
  UseRadioGroupProps,
} from './utilities';
export {
  RovingFocusItem,
  RovingFocusRoot,
  useCheckboxGroup,
  /** @deprecated This export is deprecated. Use utility libraries or create your own utility function. */
  useDebounceCallback,
  /** @deprecated This export is deprecated. Use utility libraries or create your own utility function. */
  useIsomorphicLayoutEffect,
  /** @deprecated This export is deprecated. Use utility libraries or create your own utility function. */
  useMediaQuery,
  /** @deprecated This export is deprecated. Use pagination utility function instead. */
  usePagination,
  useRadioGroup,
  useSynchronizedAnimation,
} from './utilities';
