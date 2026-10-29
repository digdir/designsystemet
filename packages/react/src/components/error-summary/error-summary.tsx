import type { DSErrorSummaryElement } from '@digdir/designsystemet-web';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type ErrorSummaryProps = HTMLAttributes<DSErrorSummaryElement> &
  DefaultProps;

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
export const ErrorSummary = forwardRef<
  DSErrorSummaryElement,
  ErrorSummaryProps
>(function ErrorSummary({ className, ...rest }, ref) {
  return (
    <ds-error-summary
      class={cl('ds-error-summary', className)}
      ref={ref}
      suppressHydrationWarning
      {...rest}
    />
  );
});
