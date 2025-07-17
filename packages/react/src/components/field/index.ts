import { Field as FieldParent } from './field';
import { FieldAffix, FieldAffixes } from './field-affix';
import { FieldCounter } from './field-counter';
import { FieldDescription } from './field-description';

type Field = typeof FieldParent & {
  /**
   * Field description component, used to provide additional information below the input.
   *
   * @example
   * <Field.Description>Additional information</Field.Description>
   */
  Description: typeof FieldDescription;
  /**
   * Field affixes component, used to display affixes like currency or unit.
   *
   * @example
   * <Field.Affixes>
   *   <Field.Affix>NOK</Field.Affix>
   *   <Input />
   *   <Field.Affix>pr. mnd.</Field.Affix>
   * </Field.Affixes>
   */
  Affixes: typeof FieldAffixes;
  /**
   * Field Affix component, used to wrap a form field.
   * Used within Field.Affixes.
   *
   * @example
   * <Field.Affixes>
   *   <Field.Affix>NOK</Field.Affix>
   *   <Input />
   *   <Field.Affix>pr. mnd.</Field.Affix>
   * </Field.Affixes>
   */
  Affix: typeof FieldAffix;
  /**
   * Field counter component, used to display a character counter for the field.
   *
   * @example
   * <Field>
   *   <Input />
   *   <Field.Counter limit={100} under='%d tegn igjen' over='%d tegn for mye' />
   * </Field>
   */
  Counter: typeof FieldCounter;
};

/**
 * Field component, used to wrap a form field.
 *
 * @example
 * <Field>
 *   <Label>Kort beskrivelse</Label>
 *   <Field.Description>Beskrivelse</Field.Description>
 *   <Input />
 *   <ValidationMessage>Feilmelding</ValidationMessage>
 * </Field>
 */
const FieldComponent: Field = Object.assign(FieldParent, {
  Description: FieldDescription,
  Affixes: FieldAffixes,
  Affix: FieldAffix,
  Counter: FieldCounter,
});

FieldComponent.Description.displayName = 'Field.Description';
FieldComponent.Affixes.displayName = 'Field.Affixes';
FieldComponent.Affix.displayName = 'Field.Affix';
FieldComponent.Counter.displayName = 'Field.Counter';

export type { FieldProps } from './field';
export type {
  FieldAffixesProps,
  FieldAffixProps,
} from './field-affix';
export type { FieldCounterProps } from './field-counter';
export type { FieldDescriptionProps } from './field-description';
export {
  FieldComponent as Field,
  FieldDescription,
  FieldAffix,
  FieldAffixes,
  FieldCounter,
};
