export type ComboboxFilter =
  | ((inputValue: string, options: string[]) => string[])
  | ((inputValue: string) => string[]);
