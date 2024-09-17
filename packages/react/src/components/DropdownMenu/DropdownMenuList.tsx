import cl from 'clsx/lite';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type DropdownMenuListProps = HTMLAttributes<HTMLUListElement>;

export const DropdownMenuList = forwardRef<
  HTMLUListElement,
  DropdownMenuListProps
>(function DropdownMenuGroup({ className, ...rest }, ref) {
  return (
    <ul
      ref={ref}
      role='group'
      className={cl('ds-dropdownmenu__list', className)}
      {...rest}
    />
  );
});
