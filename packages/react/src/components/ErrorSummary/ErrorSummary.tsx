import cl from 'clsx/lite';
import { createContext, forwardRef, useId, useState } from 'react';
import type { HTMLAttributes } from 'react';
import type { Size } from '../../types';

type ErrorSummaryContextType = {
  headingId?: string;
  setHeadingId: (id: string) => void;
};

export const ErrorSummaryContext = createContext<ErrorSummaryContextType>({
  headingId: 'heading',
  setHeadingId: () => {},
});

export type ErrorSummaryProps = {
  'data-size'?: Size;
} & HTMLAttributes<HTMLDivElement>;

export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary(
    {
      className,
      role = 'alert',
      'aria-live': ariaLive = 'polite',
      'aria-relevant': ariaRelevant = 'all',
      ...rest
    },
    ref,
  ) {
    const randomId = useId();
    const [headingId, setHeadingId] = useState<string>(randomId);

    return (
      <ErrorSummaryContext.Provider value={{ headingId, setHeadingId }}>
        <div
          aria-labelledby={headingId}
          aria-live={ariaLive}
          aria-relevant={ariaRelevant}
          className={cl('ds-error-summary', className)}
          ref={ref}
          role={role}
          {...rest}
        />
      </ErrorSummaryContext.Provider>
    );
  },
);
