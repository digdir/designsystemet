import type { ComboboxOption } from './ComboboxOption';

export type ComboboxFilter =
  | ((inputValue: string, options: ComboboxOption[]) => ComboboxOption[])
  | ((inputValue: string) => ComboboxOption[]);
