import { countries } from './countries';

export const getCountryName = (code: string): string =>
  code in countries ? countries[code as keyof typeof countries] : '';
