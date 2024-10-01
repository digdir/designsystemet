import cl from 'clsx/lite';
import { createContext, forwardRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import type { Placement } from '@floating-ui/react';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';

export type DropdownProps = {
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
  children: ReactNode;
} & Omit<PopoverProps, 'variant' | 'placement'>;

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function DropddownMenuContent(
    { placement = 'bottom-end', className, ...rest },
    ref,
  ) {
    const [size, setSize] = useState<NonNullable<DropdownProps['size']>>(
      rest.size || 'md',
    );

    useEffect(() => {
      setSize(rest.size || 'md');
    }, [rest.size]);

    return (
      <DropdownCtx.Provider
        value={{
          size,
        }}
      >
        <Popover
          ref={ref}
          placement={placement}
          size={size}
          className={cl('ds-dropdown', className)}
          {...rest}
        />
      </DropdownCtx.Provider>
    );
  },
);

type DropdownMenuCtxType = {
  size: NonNullable<DropdownProps['size']>;
};

export const DropdownCtx = createContext<DropdownMenuCtxType>({
  size: 'md',
});
