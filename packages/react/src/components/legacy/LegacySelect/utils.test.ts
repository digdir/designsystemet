import type { LegacySingleSelectOption } from './types';
import { optionSearch } from './utils';

describe('Select utils', () => {
  describe('optionSearch', () => {
    it('Returns options sorted by labels and keywords', () => {
      const options: LegacySingleSelectOption[] = [
        {
          label: 'Katt',
          value: 'katt',
          keywords: ['pus', 'Felis catus'],
        },
        {
          label: 'Hund',
          value: 'hund',
          keywords: ['Canis lupus familiaris'],
        },
        {
          label: 'Kanin',
          value: 'kanin',
          keywords: ['Oryctolagus cuniculus'],
        },
        {
          label: 'Ape',
          value: 'ape',
          keywords: ['apekatt'],
        },
      ];
      const result = optionSearch(options, 'katt');
      expect(result[0].value).toEqual('katt'); // Exact match on label
      expect(result[1].value).toEqual('ape'); // Match in keyword "apekatt"
      expect(result[2].value).toEqual('kanin'); // Partial match on "Ka" in label
      expect(result[3].value).toEqual('hund'); // Partial match on "a" in keyword
    });

    it('Returns options sorted by labels if keywords are not given', () => {
      const options: LegacySingleSelectOption[] = [
        {
          label: 'Katt',
          value: '1',
        },
        {
          label: 'Hund',
          value: '2',
        },
        {
          label: 'Kanin',
          value: '3',
        },
        {
          label: 'Ape',
          value: '4',
        },
      ];
      const result = optionSearch(options, 'Katt');
      expect(result[0].label).toEqual('Katt'); // Exact match
      expect(result[1].label).toEqual('Kanin'); // Partial match on "Ka"
      expect(result[2].label).toEqual('Ape'); // Partial match on "A"
      expect(result[3].label).toEqual('Hund'); // No match
    });
  });
});
