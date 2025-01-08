import { ValidationMessage } from '../../ValidationMessage';
import type { ComboboxProps } from '../Combobox';
import type { useFormField } from '../useFormField/useFormField';

type ComboboxErrorProps = {
  size: ComboboxProps['size'];
  error?: ComboboxProps['error'];
  formFieldProps: ReturnType<typeof useFormField>;
};

const ComboboxError = ({ size, error, formFieldProps }: ComboboxErrorProps) => {
  return (
    <div
      className={'ds-combobox__error-message'}
      id={formFieldProps.errorId}
      aria-live='polite'
      aria-relevant='additions removals'
    >
      {error && <ValidationMessage data-size={size}>{error}</ValidationMessage>}
    </div>
  );
};

ComboboxError.displayName = 'ComboboxError';

export default ComboboxError;
