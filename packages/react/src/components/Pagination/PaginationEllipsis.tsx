import { forwardRef, useContext } from 'react';
import cl from 'clsx/lite';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

import { PaginationContext } from './PaginationRoot';

export type PaginationEllipsisProps = Omit<
  ParagraphProps,
  'size' | 'spacing' | 'short'
>;

const PaginationEllipsis = forwardRef<
  HTMLParagraphElement,
  PaginationEllipsisProps
>(({ className, ...rest }, ref) => {
  const { size } = useContext(PaginationContext);

  return (
    <Paragraph
      ref={ref}
      className={cl('ds-pagination__ellipsis', className)}
      size={size}
      {...rest}
    >
      …
    </Paragraph>
  );
});

PaginationEllipsis.displayName = 'PaginationEllipsis';

export { PaginationEllipsis };
