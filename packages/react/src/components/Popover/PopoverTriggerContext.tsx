import { createContext, useId, useState } from 'react';
import type { ReactNode } from 'react';

export type PopoverTriggerContextProps = {
  children: ReactNode;
};

/**
 * PopoverTriggerContext component, use to wrap a Popover.Trigger and Popover.
 *
 * @example
 * <Popover.TriggerContext>
 *   <Popover.Trigger>Open Popover</Popover.Trigger>
 *   <Popover>
 *     Content
 *   </Popover>
 * </Popover.TriggerContext>
 */
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
