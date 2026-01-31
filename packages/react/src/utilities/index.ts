export type {
  UseCheckboxGroupProps,
  UsePaginationProps,
  UseRadioGroupProps,
} from './hooks';
export {
  useCheckboxGroup,
  useDebounceCallback,
  useIsomorphicLayoutEffect,
  useMediaQuery,
  usePagination,
  useRadioGroup,
  useSynchronizedAnimation,
} from './hooks';
export {
  getNextFocusableValue,
  getPrevFocusableValue,
  RovingFocusItem,
} from './roving-focus/roving-focus-item';
export { RovingFocusRoot } from './roving-focus/roving-focus-root';
export { useRovingFocus } from './roving-focus/use-roving-focus';
export type { MergeRight } from './types';

declare global {
  interface Window {
    dsWarnings?: boolean;
  }
}
export const warn = (
  message: string,
  ...args: Parameters<typeof console.warn>
) =>
  typeof window === 'undefined' ||
  window.dsWarnings === false ||
  console.warn(`Designsystemet: ${message}`, ...args);
