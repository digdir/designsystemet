import { Field as FieldParent } from './Field';
import { FieldHelp } from './FieldHelp';
import { FieldValidation } from './FieldValidation';

/**
 * @example
 * <Field>
 *  <Label>Label text</Label>
 *  <Field.Help>Help text</Field.Help>
 *  <Input />
 *  <Field.Validation>Validation message</Field.Validation>
 * </Field>
 */
const Field = Object.assign(FieldParent, {
  Help: FieldHelp,
  Validation: FieldValidation,
});

Field.Help.displayName = 'Field.Help';
Field.Validation.displayName = 'Field.Validation';

export type { FieldProps } from './Field';
export type { FieldHelpProps } from './FieldHelp';
export { Field, FieldHelp, FieldValidation };
