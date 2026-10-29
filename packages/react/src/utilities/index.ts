export type {
  UseCheckboxGroupProps,
  UsePaginationProps,
  UseRadioGroupProps,
} from './hooks';
export {
  useCheckboxGroup,
  usePagination,
  useRadioGroup,
  useSynchronizedAnimation,
} from './hooks';
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
