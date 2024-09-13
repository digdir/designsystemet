import cl from 'clsx/lite';
import { forwardRef, useContext } from 'react';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

import { PaginationContext } from './PaginationRoot';

export type PaginationEllipsisProps = Omit<
  ParagraphProps,
  'size' | 'spacing' | 'short'
>;

export const PaginationEllipsis = forwardRef<
  HTMLParagraphElement,
  PaginationEllipsisProps
>(function PaginationEllipsis({ className, ...rest }, ref) {
  const { size } = useContext(PaginationContext);

  return (
    <Paragraph
      ref={ref}
      className={cl('ds-pagination__ellipsis', className)}
      size={size}
      {...rest}
    >
      &hellip;
    </Paragraph>
  );
});
