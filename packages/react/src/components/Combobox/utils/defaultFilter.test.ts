import { countries } from '../test-data/countries';

import { defaultFilter } from './defaultFilter';

describe('defaultFilter', () => {
  const searchString = 'bar';
  const result = defaultFilter(searchString, Object.values(countries));

  it('Keeps matching values', () => {
    expect(result).toContain('Barbados');
    expect(result).toContain('Bahrain');
    expect(result).toContain('Antigua og Barbuda');
    expect(result).toContain('Bulgaria');
    expect(result).toContain('Belarus');
  });

  it('Filters out values that do not match', () => {
    expect(result).not.toContain('Andorra');
    expect(result).not.toContain('Norge');
    expect(result).not.toContain('Sverige');
    expect(result).not.toContain('Danmark');
    expect(result).not.toContain('Singapore');
  });
});
