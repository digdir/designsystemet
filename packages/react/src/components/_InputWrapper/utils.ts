export enum InputVariant {
  Default = 'default',
  Error = 'error',
  Disabled = 'disabled',
  ReadOnlyInfo = 'readonly-info',
  ReadOnlyConfirm = 'readonly-confirm',
}

export enum ReadOnlyVariant {
  ReadOnlyInfo = 'readonly-info',
  ReadOnlyConfirm = 'readonly-confirm',
}

export enum IconVariant {
  None = 'none',
  Error = 'error',
  Search = 'search',
}

interface GetVariantProps {
  readOnly?: boolean | ReadOnlyVariant;
  disabled?: boolean;
  isValid?: boolean;
  isSearch?: boolean;
}

export const getVariant = ({
  readOnly = false,
  disabled = false,
  isValid = true,
  isSearch = false,
}: GetVariantProps = {}) => {
  let iconVar = IconVariant.None;

  if (isSearch) {
    iconVar = IconVariant.Search;
  }

  if (disabled) {
    return {
      variant: InputVariant.Disabled,
      iconVariant: iconVar,
    };
  } else if (readOnly === true || readOnly === ReadOnlyVariant.ReadOnlyInfo) {
    return {
      variant: InputVariant.ReadOnlyInfo,
      iconVariant: iconVar,
    };
  } else if (readOnly === ReadOnlyVariant.ReadOnlyConfirm) {
    return {
      variant: InputVariant.ReadOnlyConfirm,
      iconVariant: iconVar,
    };
  } else if (isValid === false) {
    return {
      variant: InputVariant.Error,
      iconVariant: IconVariant.Error,
    };
  }

  return {
    variant: InputVariant.Default,
    iconVariant: iconVar,
  };
};
