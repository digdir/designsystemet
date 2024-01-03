import React from 'react';

export type PopoverContentProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const PopoverContent: React.FC<PopoverContentProps> = ({ ...rest }) => (
  <div {...rest} />
);
