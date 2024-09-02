import cl from 'clsx/lite';
import { createContext, forwardRef, useId, useState } from 'react';

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
} & React.HTMLAttributes<HTMLDivElement>;

export const ErrorSummaryRoot = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  (
    {
      className,
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
        <div
          className={cl('ds-error-summary', className)}
          ref={ref}
          role={role}
          aria-live={ariaLive}
          aria-relevant={ariaRelevant}
          aria-labelledby={headingId}
          {...rest}
        >
          <List size={size}>{children}</List>
        </div>
      </ErrorSummaryContext.Provider>
    );
  },
);

ErrorSummaryRoot.displayName = 'ErrorSummaryRoot';
