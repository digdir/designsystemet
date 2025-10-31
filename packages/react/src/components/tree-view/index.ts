import {
  TreeView as TreeViewParent,
  type TreeView as TreeViewRoot,
} from './tree-view';
import { TreeViewCollapse, TreeViewSummary } from './tree-view-collapse';
import { TreeViewItem } from './tree-view-item';

type TreeViewComponent = typeof TreeViewRoot & {
  Item: typeof TreeViewItem;
  Collapse: typeof TreeViewCollapse;
  Summary: typeof TreeViewSummary;
};

/**
 * Display a group of buttons that can be toggled between.
 *
 * @example
 * <ToggleGroup onChange={(value) => console.log(value)}>
 *   <ToggleGroup.Item value='1'>Toggle 1</ToggleGroup.Item>
 *   <ToggleGroup.Item value='2'>Toggle 2</ToggleGroup.Item>
 *   <ToggleGroup.Item value='3'>Toggle 3</ToggleGroup.Item>
 * </ToggleGroup>
 */
const TreeViewComponent: TreeViewComponent = Object.assign(TreeViewParent, {
  Item: TreeViewItem,
  Collapse: TreeViewCollapse,
  Summary: TreeViewSummary,
});

export {
  TreeViewComponent as TreeView,
  TreeViewItem,
  TreeViewCollapse,
  TreeViewSummary,
};
