import { getCountryName } from './getCountryName';

test('getCountryName', () => {
  expect(getCountryName('')).toBe('');
  expect(getCountryName('NO')).toBe('Norge');
});
