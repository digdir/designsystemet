import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import { useState, forwardRef, createContext } from 'react';

export type ListContextType = {
  size: 'sm' | 'md' | 'lg';
  headingId?: string;
  setHeadingId: (id: string) => void;
};

export const ListContext = createContext<ListContextType>({
  size: 'md',
  headingId: 'heading',
  setHeadingId: () => {},
});

export type ListProps = {
  /**
   * Changes text sizing
   * @default md
   *
   */
  size?: ListContextType['size'];
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ListRoot = forwardRef<HTMLDivElement, ListProps>(
  ({ size = 'md', asChild, ...rest }, ref) => {
    const [headingId, setHeadingId] = useState<string>();
    const Component = asChild ? Slot : 'div';

    return (
      <ListContext.Provider value={{ size, headingId, setHeadingId }}>
        <Component ref={ref} {...rest} />
      </ListContext.Provider>
    );
  },
);

ListRoot.displayName = 'ListRoot';
