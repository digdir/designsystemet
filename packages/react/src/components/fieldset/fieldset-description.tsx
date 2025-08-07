import { forwardRef } from 'react';
import { Paragraph, type ParagraphProps } from '../paragraph/paragraph';

export type FieldsetDescriptionProps = ParagraphProps;

/**
 * FieldsetDescription component, used to display a description for a fieldset.
 *
 * @example
 * <FieldsetDescription>
 *   Gi en kort beskrivelse i begge feltene
 * </FieldsetDescription>
 */
export const FieldsetDescription = forwardRef<
  HTMLLegendElement,
  FieldsetDescriptionProps
>(function FieldsetDescription(rest, ref) {
  return <Paragraph ref={ref} {...rest} />;
});
