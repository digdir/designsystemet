import type { HTMLAttributes } from 'react';

export type TreeViewItemProps = HTMLAttributes<HTMLDivElement>;

export const TreeViewItem = ({ ...rest }: TreeViewItemProps) => {
  return <div {...rest} />;
};
