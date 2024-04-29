import { forwardRef, useContext } from 'react';
import cl from 'clsx';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

import classes from './Pagination.module.css';
import { PaginationContext } from './PaginationRoot';

export type PaginationEllipsisProps = Omit<ParagraphProps, 'size' | 'spacing' | 'short'>;

export const PaginationEllipsis = forwardRef<HTMLParagraphElement, PaginationEllipsisProps>(
  ({ className, ...rest }, ref) => {
    const { size } = useContext(PaginationContext);

    return (
      <Paragraph
        ref={ref}
        className={cl(classes.ellipsis, className)}
        size={size}
        {...rest}
      >
        …
      </Paragraph>
    );
  },
);

export default PaginationEllipsis;
