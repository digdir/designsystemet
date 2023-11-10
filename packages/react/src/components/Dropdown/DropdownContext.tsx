import { createContext } from 'react';

import type { DropdownProps } from './Dropdown';

type DropdownContextType = {
  size: NonNullable<DropdownProps['size']>;
};

export const DropdownContext = createContext<DropdownContextType>({
  size: 'medium',
});
