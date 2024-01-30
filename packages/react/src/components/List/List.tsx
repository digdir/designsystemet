import type { HTMLAttributes } from 'react';
import React from 'react';

export type ListProps = {
  /** Changes text sizing
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
} & HTMLAttributes<HTMLDivElement>;

export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ children, size = 'medium', ...rest }, ref) => {
    const [headingId, setHeadingId] = React.useState<string | null>(null);

    return (
      <ListContext.Provider value={{ size, headingId, setHeadingId }}>
        <div
          {...rest}
          ref={ref}
        >
          {children}
        </div>
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
