import cl from 'clsx/lite';
import { createContext, forwardRef, useId, useState } from 'react';

import type { ListUnorderedProps } from '../List';

type ErrorSummaryContextType = {
  size: ListUnorderedProps['size'];
  headingId?: string;
  setHeadingId: (id: string) => void;
};

export const ErrorSummaryContext = createContext<ErrorSummaryContextType>({
  size: 'md',
  headingId: 'heading',
  setHeadingId: () => {},
});

export type ErrorSummaryProps = {
  size?: ListUnorderedProps['size'];
} & React.HTMLAttributes<HTMLDivElement>;

export const ErrorSummaryRoot = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  (
    {
      className,
      size = 'md',
      role = 'alert',
      'aria-live': ariaLive = 'polite',
      'aria-relevant': ariaRelevant = 'all',
      ...rest
    },
    ref,
  ) => {
    const randomId = useId();
    const [headingId, setHeadingId] = useState<string>(randomId);

    return (
      <ErrorSummaryContext.Provider value={{ size, headingId, setHeadingId }}>
        <div
          className={cl('ds-error-summary', className)}
          ref={ref}
          role={role}
          aria-live={ariaLive}
          aria-relevant={ariaRelevant}
          aria-labelledby={headingId}
          {...rest}
        />
      </ErrorSummaryContext.Provider>
    );
  },
);

ErrorSummaryRoot.displayName = 'ErrorSummaryRoot';
