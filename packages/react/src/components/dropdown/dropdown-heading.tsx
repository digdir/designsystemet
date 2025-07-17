import { forwardRef } from 'react';
import { Heading, type HeadingProps } from '../heading/heading';

export type DropdownHeadingProps = HeadingProps;

/**
 * DropdownHeading component, used to display a heading in the Dropdown.
 *
 * @example
 * <Dropdown>
 *  <DropdownHeading>Heading</DropdownHeading>
 * </Dropdown>
 */
export const DropdownHeading = forwardRef<
  HTMLHeadingElement,
  DropdownHeadingProps
>(function DropdownHeading({ className, ...rest }, ref) {
  return <Heading ref={ref} {...rest} />;
});
