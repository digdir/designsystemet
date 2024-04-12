import cl from 'clsx';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { Label, Paragraph } from '../../../Typography';
import type { ComboboxProps } from '../Combobox';
import type { useFormField } from '../../useFormField';
import classes from '../Combobox.module.css';

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
          className={cl(
            classes.label,
            hideLabel && `fds-utilities--visually-hidden`,
          )}
        >
          {readOnly && (
            <PadlockLockedFillIcon
              aria-hidden
              className={classes.padlock}
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
              classes.description,
              hideLabel && `fds-utilities--visually-hidden`,
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
