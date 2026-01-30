export type {
  /** @deprecated This export is deprecated. Use `Size` from `@digdir/designsystemet-types` */
  Size,
} from '@digdir/designsystemet-types';
export * from './components';
export { omit } from './components/Combobox/omit/omit'; //deprecated
export type { LabelRequired } from './types';
export type {
  /** @deprecated This export is deprecated. */
  MergeRight,
  UseCheckboxGroupProps,
  UsePaginationProps,
  UseRadioGroupProps,
} from './utilities';
export {
  RovingFocusItem,
  RovingFocusRoot,
  useCheckboxGroup,
  /** @deprecated This export is deprecated. Use utility libraries or create your own utility function. */
  useClickDelegateFor,
  /** @deprecated This export is deprecated. Use utility libraries or create your own utility function. */
  useDebounceCallback,
  /** @deprecated This export is deprecated. Use utility libraries or create your own utility function. */
  useIsomorphicLayoutEffect,
  useMediaQuery,
  usePagination,
  useRadioGroup,
  useSynchronizedAnimation,
} from './utilities';
