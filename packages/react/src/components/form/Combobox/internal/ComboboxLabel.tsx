import cl from 'clsx/lite';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { Label, Paragraph } from '../../../Typography';
import type { ComboboxProps } from '../Combobox';
import type { useFormField } from '../../useFormField';

type ComboboxLabelProps = {
  label?: ComboboxProps['label'];
  description?: ComboboxProps['description'];
  hideLabel?: ComboboxProps['hideLabel'];
  size?: ComboboxProps['size'];
  readOnly?: ComboboxProps['readOnly'];
  formFieldProps: ReturnType<typeof useFormField>;
};

export const ComboboxLabel = ({
  label,
  description,
  hideLabel,
  size,
  readOnly,
  formFieldProps,
}: ComboboxLabelProps) => {
  return (
    <>
      {label && (
        <Label
          size={size}
          htmlFor={formFieldProps.inputProps.id}
          className={cl('fds-combobox__label', hideLabel && `fds-sr-only`)}
        >
          {readOnly && (
            <PadlockLockedFillIcon
              aria-hidden
              className={'fds-combobox__readonly__icon'}
            />
          )}
          {label}
        </Label>
      )}
      {description && (
        <Paragraph
          asChild
          size={size}
        >
          <div
            id={formFieldProps.descriptionId}
            className={cl(
              'fds-combobox__description',
              hideLabel && `fds-sr-only`,
            )}
          >
            {description}
          </div>
        </Paragraph>
      )}
    </>
  );
};

ComboboxLabel.displayName = 'ComboboxLabel';

export default ComboboxLabel;
