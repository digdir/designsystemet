import { countries } from './countries';
import { customFilter } from './customFilter';

describe('customFilter', () => {
  const searchString = 'bar';
  const result = customFilter(searchString, Object.keys(countries));

  it('Filters out countries that do not match', () => {
    expect(result).toContain('BB'); // Barbados
    expect(result).toContain('BH'); // Bahrain
    expect(result).toContain('AG'); // Antigua og Barbuda
    expect(result).toContain('BG'); // Bulgaria
    expect(result).toContain('BY'); // Belarus
    expect(result).not.toContain('AD'); // Andorra
    expect(result).not.toContain('NO'); // Norge
    expect(result).not.toContain('SE'); // Sverige
    expect(result).not.toContain('DK'); // Danmark
    expect(result).not.toContain('SG'); // Singapore
  });

  it('Sorts countries by the indices of matching characters', () => {
    const indexOfBarbados = result.indexOf('BB');
    const indexOfBahrain = result.indexOf('BH');
    const indexOfBulgaria = result.indexOf('BG');
    expect(indexOfBarbados).toBeLessThan(indexOfBahrain);
    expect(indexOfBulgaria).toBeGreaterThan(indexOfBahrain);
  });
});
