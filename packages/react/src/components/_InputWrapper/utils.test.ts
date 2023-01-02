import {
  getVariant,
  InputVariant,
  IconVariant,
  ReadOnlyVariant,
} from './utils';

describe('Textfield utils', () => {
  describe('getVariant', () => {
    it('Returns default variant and no icon by default', () => {
      const result = getVariant();
      expect(result).toEqual({
        variant: InputVariant.Default,
        iconVariant: IconVariant.None,
      });
    });

    it('Return disabled as variant and no icon when disabled is true', () => {
      const result = getVariant({ disabled: true });
      expect(result).toEqual({
        variant: InputVariant.Disabled,
        iconVariant: IconVariant.None,
      });
    });

    it('Return ReadOnlyInfo as variant and no icon when readonly is true', () => {
      const result = getVariant({ readOnly: true });
      expect(result).toEqual({
        variant: InputVariant.ReadOnlyInfo,
        iconVariant: IconVariant.None,
      });
    });

    it('Returns ReadOnlyInfo as variant and no icon when readonly is ReadOnlyVariant.ReadOnlyInfo', () => {
      const result = getVariant({ readOnly: ReadOnlyVariant.ReadOnlyInfo });
      expect(result).toEqual({
        variant: InputVariant.ReadOnlyInfo,
        iconVariant: IconVariant.None,
      });
    });

    it('Returns ReadOnlyConfirm as variant and no icon when readonly is ReadOnlyVariant.ReadOnlyConfirm', () => {
      const result = getVariant({ readOnly: ReadOnlyVariant.ReadOnlyConfirm });
      expect(result).toEqual({
        variant: InputVariant.ReadOnlyConfirm,
        iconVariant: IconVariant.None,
      });
    });

    it('Returns ReadOnlyConfirm as variant and Error icon when isValid is false', () => {
      const result = getVariant({ isValid: false });
      expect(result).toEqual({
        variant: InputVariant.Error,
        iconVariant: IconVariant.Error,
      });
    });
  });
});
