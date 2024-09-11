import { useId, useRef, useState } from 'react';
import { createContext, useEffect } from 'react';

export type PopoverContextProps = {
  children: React.ReactNode;
};

export const PopoverContext = ({ children }: PopoverContextProps) => {
  const randomPopoverId = useId();
  const [popoverId, setPopoverId] = useState(randomPopoverId);

  return (
    <Context.Provider value={{ popoverId, setPopoverId }}>
      {children}
    </Context.Provider>
  );
};

PopoverContext.displayName = 'PopoverContext';

export const Context = createContext<{
  popoverId?: string;
  setPopoverId?: (id: string) => void;
}>({});
