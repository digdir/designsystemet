import { ErrorMessage } from '../../../Typography';
import type { ComboboxProps } from '../Combobox';
import type { useFormField } from '../../useFormField';

type ComboboxErrorProps = {
  size: ComboboxProps['size'];
  error?: ComboboxProps['error'];
  formFieldProps: ReturnType<typeof useFormField>;
};

export const ComboboxError = ({
  size,
  error,
  formFieldProps,
}: ComboboxErrorProps) => {
  return (
    <div
      className={'ds-combobox__error-message'}
      id={formFieldProps.errorId}
      aria-live='polite'
      aria-relevant='additions removals'
    >
      {error && <ErrorMessage size={size}>{error}</ErrorMessage>}
    </div>
  );
};

ComboboxError.displayName = 'ComboboxError';

export default ComboboxError;
