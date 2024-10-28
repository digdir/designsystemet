import cl from 'clsx/lite';
import { forwardRef } from 'react';

import type { ButtonProps } from '../Button';
import { Button } from '../Button/Button';

export type DropdownItemProps = Omit<ButtonProps, 'variant' | 'size' | 'color'>;

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem({ className, ...rest }, ref) {
    /* All attributes are set on the <Button>, since li is possible to style from <Dropdown.List> className  */
    return (
      <li>
        <Button
          className={cl('ds-dropdown__item', className)}
          ref={ref}
          variant='tertiary'
          {...rest}
        />
      </li>
    );
  },
);
