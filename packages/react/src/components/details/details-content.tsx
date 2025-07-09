import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type DetailsContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * Details content component, contains the content of the details item.
 *
 * @example
 * <DetailsContent>Content</DetailsContent>
 */
export const DetailsContent = forwardRef<HTMLDivElement, DetailsContentProps>(
  function DetailsContent(rest, ref) {
    return <div ref={ref} {...rest} />;
  },
);
