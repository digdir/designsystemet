import { forwardRef } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button/Button';

export type DropdownItemProps = Omit<ButtonProps, 'variant' | 'color'>;

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem({ className, style, ...rest }, ref) {
    return (
      <li className={className} style={style}>
        <Button
          className='ds-dropdown__item'
          ref={ref}
          variant='tertiary'
          {...rest}
        />
      </li>
    );
  },
);
