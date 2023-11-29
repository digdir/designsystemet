import React, { forwardRef, useContext } from 'react';

import { ComboboxContext } from '../Combobox';

type ComboboxEmptyProps = React.HTMLAttributes<HTMLDivElement>;

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, ...rest }, ref) => {
    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxItem must be used within a Combobox');
    }

    const { showEmptyChild } = context;

    return (
      showEmptyChild && (
        <div
          {...rest}
          ref={ref}
        >
          {children}
        </div>
      )
    );
  },
);

export default ComboboxEmpty;
