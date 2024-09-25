// TMP File, maybe ValidationMessage can just be this?
import { forwardRef } from 'react';
import { ValidationMessage } from '../../Typography';
import type { ValidationMessageProps } from '../../Typography';

export type FieldValidationProps = ValidationMessageProps;

export const FieldValidation = forwardRef<
  HTMLDivElement,
  ValidationMessageProps
>(function FieldValidation(rest, ref) {
  return <ValidationMessage data-field-validation ref={ref} {...rest} />;
});
