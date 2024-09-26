import { Field as FieldParent } from './Field';
import { FieldDescription } from './FieldDescription';

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
});

Field.Description.displayName = 'Field.Description';

export type { FieldProps } from './Field';
export type { FieldDescriptionProps } from './FieldDescription';
export { Field, FieldDescription };
