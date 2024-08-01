import cl from 'clsx/lite';
import { forwardRef, useContext } from 'react';
import type * as React from 'react';

import { Label } from '../../Typography';

import { ComboboxContext } from './ComboboxContext';

type ComboboxEmptyProps = React.HTMLAttributes<HTMLDivElement>;

const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, className, ...rest }, ref) => {
    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxEmpty must be used within a Combobox');
    }

    const { filteredOptions, size } = context;

    return (
      filteredOptions.length === 0 && (
        <Label size={size} asChild>
          <div
            ref={ref}
            className={cl('ds-combobox__empty', className)}
            {...rest}
          >
            {children}
          </div>
        </Label>
      )
    );
  },
);

ComboboxEmpty.displayName = 'ComboboxEmpty';

export { ComboboxEmpty };
