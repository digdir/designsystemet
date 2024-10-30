import { forwardRef } from 'react';

import { Paragraph, type ParagraphProps } from '../../Paragraph/Paragraph';

export type FieldsetDescriptionProps = ParagraphProps;

export const FieldsetDescription = forwardRef<
  HTMLLegendElement,
  FieldsetDescriptionProps
>(function FieldsetDescription(rest, ref) {
  return <Paragraph ref={ref} {...rest} />;
});
