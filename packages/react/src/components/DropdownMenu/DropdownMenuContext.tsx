import { createContext } from 'react';

import type { DropdownMenuProps } from './DropdownMenu';

type DropdownMenuContextType = {
  size: NonNullable<DropdownMenuProps['size']>;
};

export const DropdownMenuContext = createContext<DropdownMenuContextType>({
  size: 'medium',
});
