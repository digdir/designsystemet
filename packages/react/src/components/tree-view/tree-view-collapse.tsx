import type { HTMLAttributes } from 'react';
import '@u-elements/u-details';

export type TreeViewCollapseProps = HTMLAttributes<HTMLDetailsElement>;

export const TreeViewCollapse = ({ ...rest }: TreeViewCollapseProps) => {
  return <u-details {...rest} />;
};

export type TreeViewSummaryProps = HTMLAttributes<HTMLElement>;

export const TreeViewSummary = ({ ...rest }: TreeViewSummaryProps) => {
  return <u-summary {...rest} />;
};
