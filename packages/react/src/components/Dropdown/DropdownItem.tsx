import { forwardRef, useContext } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button';

import { DropdownCtx } from './Dropdown';

export type DropdownItemProps = Omit<ButtonProps, 'variant' | 'size' | 'color'>;

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem({ children, className, style, ...rest }, ref) {
    const { size } = useContext(DropdownCtx);

    return (
      <li className={className} style={style}>
        <Button
          ref={ref}
          variant='tertiary'
          size={size}
          className='ds-dropdown__item'
          {...rest}
        >
          {children}
        </Button>
      </li>
    );
  },
);
