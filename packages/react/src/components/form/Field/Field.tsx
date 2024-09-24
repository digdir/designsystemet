import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

export type FieldProps = HTMLAttributes<HTMLDivElement>;

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { className, ...rest } = props;

    return <div className={cl('ds-field', className)} ref={ref} {...rest} />;
  },
);
