import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type FieldHelpProps = HTMLAttributes<HTMLDivElement>;

export const FieldHelp = forwardRef<HTMLDivElement, FieldHelpProps>(
  function FieldHelp(rest, ref) {
    return <div data-field-help ref={ref} {...rest} />;
  },
);
