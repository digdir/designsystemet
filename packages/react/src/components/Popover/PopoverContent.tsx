import React, { forwardRef } from 'react';

export interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export type PopoverContentType = React.ForwardRefExoticComponent<
  PopoverContentProps & React.RefAttributes<HTMLDivElement>
>;

export const PopoverContent: PopoverContentType = forwardRef(
  ({ className, ...rest }, ref) => (
    <div
      {...rest}
      ref={ref}
      className={className}
    />
  ),
);
