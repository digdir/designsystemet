import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type ErrorSummaryProps = {
  /**
   * @deprecated This is not supported anymore, as the element needs to be `ds-error-summary`
   */
  asChild?: React.ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement> & DefaultProps, 'data-color'>;

/**
 * ErrorSummary component, used to display a list of errors.
 *
 * @example
 * <ErrorSummary>
 *   <ErrorSummary.Heading>Heading</ErrorSummary.Heading>
 *   <ErrorSummary.List>
 *     <ErrorSummary.Item>
 *       <ErrorSummary.Link href='#'>Error 1</ErrorSummary.Link>
 *     </ErrorSummary.Item>
 *     <ErrorSummary.Item>
 *       <ErrorSummary.Link href='#'>Error 2</ErrorSummary.Link>
 *     </ErrorSummary.Item>
 *   </ErrorSummary.List>
 * </ErrorSummary>
 */
export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary({ asChild, className, ...rest }, ref) {
    const Component = asChild ? Slot : 'ds-error-summary';

    return (
      <Component
        {...(asChild
          ? { className: cl('ds-error-summary', className) }
          : { class: cl('ds-error-summary', className) })}
        ref={ref}
        suppressHydrationWarning
        {...rest}
      />
    );
  },
);
