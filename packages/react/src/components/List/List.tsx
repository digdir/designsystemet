import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes } from 'react';
import React from 'react';

export type ListProps = {
  /** Changes text sizing
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ asChild, size = 'medium', ...rest }, ref) => {
    const [headingId, setHeadingId] = React.useState<string | null>(null);

    const Component = asChild ? Slot : 'div';

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

type ListContextType = {
  size: NonNullable<ListProps['size']>;
  headingId: string | null;
  setHeadingId: (id: string) => void;
};

export const ListContext = React.createContext<ListContextType>({
  size: 'medium',
  headingId: 'heading',
  setHeadingId: () => {},
});
