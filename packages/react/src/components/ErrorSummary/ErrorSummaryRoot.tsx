import type { HTMLAttributes } from 'react';
import { createContext, forwardRef, useId, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';

import type { ListProps } from '../List';
import { List } from '../List';

type ErrorSummaryContextType = {
  headingId?: string;
  setHeadingId: (id: string) => void;
};

export const ErrorSummaryContext = createContext<ErrorSummaryContextType>({
  headingId: 'heading',
  setHeadingId: () => {},
});

export type ErrorSummaryProps = {
  size?: ListProps['size'];
} & HTMLAttributes<HTMLDivElement>;

export const ErrorSummaryRoot = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  (
    {
      size,
      role = 'alert',
      'aria-live': ariaLive = 'polite',
      'aria-relevant': ariaRelevant = 'all',
      children,
      ...rest
    },
    ref,
  ) => {
    const randomId = useId();
    const [headingId, setHeadingId] = useState<string>(randomId);

    return (
      <ErrorSummaryContext.Provider value={{ headingId, setHeadingId }}>
        <Slot
          className={'ds-error-summary'}
          ref={ref}
          role={role}
          aria-live={ariaLive}
          aria-relevant={ariaRelevant}
          aria-labelledby={headingId}
          {...rest}
        >
          <List.Root size={size}>{children}</List.Root>
        </Slot>
      </ErrorSummaryContext.Provider>
    );
  },
);

ErrorSummaryRoot.displayName = 'ErrorSummaryRoot';
