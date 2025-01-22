import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import { createContext, forwardRef, useId, useState } from 'react';
import type { HTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';

type ErrorSummaryContextType = {
  headingId?: string;
  setHeadingId: (id: string) => void;
};

export const ErrorSummaryContext = createContext<ErrorSummaryContextType>({
  headingId: 'heading',
  setHeadingId: () => {},
});

export type ErrorSummaryProps = {
  asChild?: React.ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement> & DefaultProps, 'data-color'>;

export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary(
    {
      asChild,
      role = 'alert',
      'aria-live': ariaLive = 'polite',
      'aria-relevant': ariaRelevant = 'all',
      className,
      ...rest
    },
    ref,
  ) {
    const randomId = useId();
    const [headingId, setHeadingId] = useState<string>(randomId);

    const Component = asChild ? Slot : 'div';

    return (
      <ErrorSummaryContext.Provider value={{ headingId, setHeadingId }}>
        <Component
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
