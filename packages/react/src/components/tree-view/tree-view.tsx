import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';

export type TreeViewProps = HTMLAttributes<HTMLElement>;

export const TreeView = ({ className, ...rest }: TreeViewProps) => {
  return <nav className={cl('ds-tree-view', className)} {...rest} />;
};
