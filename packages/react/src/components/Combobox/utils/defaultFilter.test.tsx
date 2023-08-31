import React from 'react';

import { countries } from '../test-data/countries';
import type { ComboboxOption } from '../types/ComboboxOption';

import { defaultFilter } from './defaultFilter';

describe('defaultFilter', () => {
  const searchString = 'bar';
  const testResultingValues = (values: string[]) => {
    it('Filters out countries that do not match', () => {
      expect(values).toContain('Barbados');
      expect(values).toContain('Bahrain');
      expect(values).toContain('Antigua og Barbuda');
      expect(values).toContain('Bulgaria');
      expect(values).toContain('Belarus');
      expect(values).not.toContain('Andorra');
      expect(values).not.toContain('Norge');
      expect(values).not.toContain('Sverige');
      expect(values).not.toContain('Danmark');
      expect(values).not.toContain('Singapore');
    });

    it('Sorts countries by matching chars', () => {
      const indexOfBarbados = values.indexOf('Barbados');
      const indexOfBahrain = values.indexOf('Bahrain');
      const indexOfBulgaria = values.indexOf('Bulgaria');
      expect(indexOfBarbados).toBeLessThan(indexOfBahrain);
      expect(indexOfBulgaria).toBeGreaterThan(indexOfBahrain);
    });
  };

  describe('When labels are primitive strings', () => {
    const primitiveOptions: ComboboxOption[] = Object.entries(countries).map(
      ([value, label]) => ({ label, value }),
    );
    const result = defaultFilter(searchString, primitiveOptions);
    const labels = result.map((option) => option.label as string);
    testResultingValues(labels);
  });

  describe('When labels are formatted', () => {
    const formattedOptions: ComboboxOption[] = Object.values(countries).map(
      (value) => ({ label: <span>${value}</span>, value }),
    );
    const result = defaultFilter(searchString, formattedOptions);
    const values = result.map((option) => option.value);
    testResultingValues(values);
  });
});
