import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import { useState, forwardRef, createContext } from 'react';

import { getSize } from '../../utilities/getSize';

export type ListContextType = {
  size: 'sm' | 'md' | 'lg';
  headingId?: string;
  setHeadingId: (id: string) => void;
};

export type OldListSizes = 'small' | 'medium' | 'large';

export const ListContext = createContext<ListContextType>({
  size: 'md',
  headingId: 'heading',
  setHeadingId: () => {},
});

export type ListProps = {
  /**
   * Changes text sizing
   * @default 'md'
   *
   * @note `small`, `medium` and `large` are deprecated
   */
  size?: ListContextType['size'] | OldListSizes;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ListRoot = forwardRef<HTMLDivElement, ListProps>(
  ({ asChild, ...rest }, ref) => {
    const [headingId, setHeadingId] = useState<string>();
    const Component = asChild ? Slot : 'div';
    const size = getSize(rest.size || 'md') as ListContextType['size'];

    return (
      <ListContext.Provider value={{ size, headingId, setHeadingId }}>
        <Component
          ref={ref}
          {...rest}
        />
      </ListContext.Provider>
    );
  },
);

ListRoot.displayName = 'ListRoot';
