export const inputVariants = [
  'default',
  'error',
  'disabled',
  'readonlyInfo',
  'readonlyConfirm',
] as const;
export type InputVariant_ = (typeof inputVariants)[number];

export type ReadOnlyVariant_ = 'readonlyInfo' | 'readonlyConfirm';

export type IconVariant_ = 'none' | 'error' | 'search';

interface GetVariantProps {
  readOnly?: boolean | ReadOnlyVariant_;
  disabled?: boolean;
  isValid?: boolean;
  isSearch?: boolean;
}

export type Variant = {
  variant: InputVariant_;
  iconVariant: IconVariant_;
};
type GetVariant = (options?: GetVariantProps) => Variant;

export const getVariant: GetVariant = ({
  readOnly = false,
  disabled = false,
  isValid = true,
  isSearch = false,
} = {}) => {
  if (readOnly === true || readOnly === 'readonlyInfo') {
    return {
      variant: 'readonlyInfo',
      iconVariant: 'none',
    };
  }

  if (readOnly === 'readonlyConfirm') {
    return {
      variant: 'readonlyConfirm',
      iconVariant: 'none',
    };
  }

  if (isValid === false) {
    return {
      variant: 'error',
      iconVariant: 'error',
    };
  }

  return {
    variant: disabled ? 'disabled' : 'default',
    iconVariant: isSearch ? 'search' : 'none',
  };
};
