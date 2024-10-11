import { Field as FieldParent } from "./Field";
import { FieldHelp } from "./FieldHelp";

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
  Help: FieldHelp,
});

Field.Help.displayName = "Field.Help";

export type { FieldProps } from "./Field";
export type { FieldHelpProps } from "./FieldHelp";
export { Field, FieldHelp };
