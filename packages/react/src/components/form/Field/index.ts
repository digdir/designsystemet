import { Field as FieldParent } from './Field';
import { FieldDescription } from './FieldDescription';
import { FieldValidation } from './FieldValidation';

/**
 * @example
 * <Field>
 *  <Label>Label text</Label>
 *  <Field.Description>Description</Field.Description>
 *  <Input />
 *  <Field.Validation>Validation message</Field.Validation>
 * </Field>
 */
const Field = Object.assign(FieldParent, {
  Description: FieldDescription,
  Validation: FieldValidation,
});

Field.Description.displayName = 'Field.Description';
Field.Validation.displayName = 'Field.Validation';

export type { FieldProps } from './Field';
export type { FieldDescriptionProps } from './FieldDescription';
export { Field, FieldDescription, FieldValidation };
