import type { Variant } from './utils';
import { getVariant } from './utils';

describe('Textfield utils', () => {
  describe('getVariant', () => {
    it('Returns default variant and no icon by default', () => {
      const result = getVariant();
      expect(result).toEqual<Variant>({
        variant: 'default',
        iconVariant: 'none',
      });
    });

    it('Return disabled as variant and no icon when disabled is true', () => {
      const result = getVariant({ disabled: true });
      expect(result).toEqual<Variant>({
        variant: 'disabled',
        iconVariant: 'none',
      });
    });

    it('Return ReadOnlyInfo as variant and no icon when readonly is true', () => {
      const result = getVariant({ readOnly: true });
      expect(result).toEqual<Variant>({
        variant: 'readonlyInfo',
        iconVariant: 'none',
      });
    });

    it('Returns ReadOnlyInfo as variant and no icon when readonly is ReadOnlyVariant.ReadOnlyInfo', () => {
      const result = getVariant({ readOnly: 'readonlyInfo' });
      expect(result).toEqual<Variant>({
        variant: 'readonlyInfo',
        iconVariant: 'none',
      });
    });

    it('Returns ReadOnlyConfirm as variant and no icon when readonly is ReadOnlyVariant.ReadOnlyConfirm', () => {
      const result = getVariant({ readOnly: 'readonlyConfirm' });
      expect(result).toEqual<Variant>({
        variant: 'readonlyConfirm',
        iconVariant: 'none',
      });
    });

    it('Returns ReadOnlyConfirm as variant and Error icon when isValid is false', () => {
      const result = getVariant({ isValid: false });
      expect(result).toEqual<Variant>({
        variant: 'error',
        iconVariant: 'error',
      });
    });
  });
});
