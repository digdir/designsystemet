import type { DSErrorSummaryElement } from '@digdir/designsystemet-web';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps } from '../../types';

export type ErrorSummaryProps = {
  /**
   * @deprecated This is not supported anymore, as the element needs to be `ds-error-summary`
   */
  asChild?: ReactNode;
} & HTMLAttributes<DSErrorSummaryElement> &
  DefaultProps;

/**
 * ErrorSummary component, used to display a list of errors.
 *
 * @example
 * <ErrorSummary>
 *   <Heading>Heading</Heading>
 *   <List.Unordered>
 *     <List.Item>
 *       <Link href='#'>Error 1</Link>
 *     </List.Item>
 *     <List.Item>
 *       <Link href='#'>Error 2</Link>
 *     </List.Item>
 *   </List.Unordered>
 * </ErrorSummary>
 */
export const ErrorSummary = forwardRef<
  DSErrorSummaryElement,
  ErrorSummaryProps
>(function ErrorSummary({ asChild, className, ...rest }, ref) {
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
});
