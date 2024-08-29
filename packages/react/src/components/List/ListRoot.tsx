import { createContext, useState } from 'react';

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
  children?: React.ReactNode;
  /**
   * Changes text sizing
   * @default md
   *
   */
  size?: ListContextType['size'];
};

export function ListRoot({ children, size = 'md' }: ListProps) {
  const [headingId, setHeadingId] = useState<string>();

  return (
    <ListContext.Provider value={{ size, headingId, setHeadingId }}>
      {children}
    </ListContext.Provider>
  );
}
