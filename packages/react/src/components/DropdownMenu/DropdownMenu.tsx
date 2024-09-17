import cl from 'clsx/lite';
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import type { Placement } from '@floating-ui/react';
import { Popover } from '../Popover';
import type { PopoverProps } from '../Popover';

export type DropdownMenuProps = {
  /** The placement of the dropdown
   * @default bottom-end
   */
  placement?: Placement;
  children: ReactNode;
} & Omit<PopoverProps, 'variant' | 'placement'>;

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropddownMenuContent(
    { placement = 'bottom-end', className, ...rest },
    ref,
  ) {
    const [size, setSize] = useState<NonNullable<DropdownMenuProps['size']>>(
      rest.size || 'md',
    );

    useEffect(() => {
      setSize(rest.size || 'md');
    }, [rest.size]);

    return (
      <DropdownMenuCtx.Provider
        value={{
          size,
        }}
      >
        <Popover
          ref={ref}
          placement={placement}
          size={size}
          className={cl('ds-dropdownmenu', className)}
          {...rest}
        />
      </DropdownMenuCtx.Provider>
    );
  },
);

type DropdownMenuCtxType = {
  size: NonNullable<DropdownMenuProps['size']>;
};

export const DropdownMenuCtx = createContext<DropdownMenuCtxType>({
  size: 'md',
});
