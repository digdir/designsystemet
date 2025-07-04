import { forwardRef } from 'react';
import { Heading, type HeadingProps } from '../Heading';

export type DropdownHeadingProps = HeadingProps;

export const DropdownHeading = forwardRef<
  HTMLHeadingElement,
  DropdownHeadingProps
>(function DropdownHeading({ className, ...rest }, ref) {
  return <Heading ref={ref} {...rest} />;
});
