import { createContext, useId, useState } from 'react';
import type { ReactNode } from 'react';

export type PopoverTriggerContextProps = {
  children: ReactNode;
};

export const PopoverTriggerContext = ({
  children,
}: PopoverTriggerContextProps) => {
  const randomPopoverId = useId();
  const [popoverId, setPopoverId] = useState(randomPopoverId);

  return (
    <Context.Provider value={{ popoverId, setPopoverId }}>
      {children}
    </Context.Provider>
  );
};

PopoverTriggerContext.displayName = 'PopoverTriggerContext';

export const Context = createContext<{
  popoverId?: string;
  setPopoverId?: (id: string) => void;
}>({});
