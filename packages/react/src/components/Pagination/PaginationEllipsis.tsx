import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useContext } from 'react';
import cl from 'clsx';

import type { ParagraphProps } from '../Typography';
import { Paragraph } from '../Typography';

import classes from './Pagination.module.css';
import { PaginationContext } from './PaginationRoot';

export type PaginationEllipsisProps = ParagraphProps;

export const PaginationEllipsis = forwardRef<
  HTMLParagraphElement,
  PaginationEllipsisProps
>(({ asChild, ...rest }, ref) => {
  const Component = asChild ? Slot : Paragraph;

  const { size } = useContext(PaginationContext);

  return (
    <Component
      ref={ref}
      className={cl(classes.ellipsis)}
      size={size}
      {...rest}
    >
      …
    </Component>
  );
});

export default PaginationEllipsis;
