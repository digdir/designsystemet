import React from 'react';

/** The `section` element does not have it's own type, so we use `HTMLElement` */
export type DropdownSectionProps = React.HTMLAttributes<HTMLElement>;

export const DropdownSection = ({
  children,
  ...rest
}: DropdownSectionProps) => {
  return <section {...rest}>{children}</section>;
};

DropdownSection.displayName = 'Dropdown.Section';
