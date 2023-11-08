import { createContext } from 'react';

import type { DropdownProps } from './Dropdown';

export const DropdownSizeContext =
  createContext<NonNullable<DropdownProps['size']>>('medium');
