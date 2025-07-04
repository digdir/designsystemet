import { forwardRef } from 'react';

import { Paragraph, type ParagraphProps } from '../Paragraph/Paragraph';

export type FieldsetDescriptionProps = ParagraphProps;

/**
 * FieldsetDescription component, used to display a description for a fieldset.
 *
 * @example
 * <Fieldset.Description>
 *   Gi en kort beskrivelse i begge feltene
 * </Fieldset.Description>
 */
export const FieldsetDescription = forwardRef<
  HTMLLegendElement,
  FieldsetDescriptionProps
>(function FieldsetDescription(rest, ref) {
  return <Paragraph ref={ref} {...rest} />;
});
