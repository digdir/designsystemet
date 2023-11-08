import { createContext } from 'react';

import type { DropdownProps } from './Dropdown';

type DropdownContextType = {
  size: NonNullable<DropdownProps['size']>;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  getItemProps:
    | null
    | ((
        userProps?: React.HTMLProps<HTMLElement> | undefined,
      ) => Record<string, unknown>);
};

export const DropdownContext = createContext<DropdownContextType>({
  size: 'medium',
  activeIndex: null,
  setActiveIndex: () => {},
  getItemProps: null,
});
