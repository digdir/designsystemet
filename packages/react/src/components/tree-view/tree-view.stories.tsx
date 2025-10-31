import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { TreeView } from './';

type Story = StoryObj<typeof TreeView>;

export default {
  title: 'Komponenter/TreeView',
  component: TreeView,
} satisfies Meta;

export const Preview: StoryFn<typeof TreeView> = () => {
  return (
    <TreeView aria-label='Eksempel på trestruktur'>
      <TreeView.Item>Item 1</TreeView.Item>
      <TreeView.Item>Item 2</TreeView.Item>
      <TreeView.Collapse>
        <TreeView.Summary>Item 3</TreeView.Summary>
        <TreeView.Item>Item 4</TreeView.Item>
        <TreeView.Item>Item 5</TreeView.Item>
      </TreeView.Collapse>
    </TreeView>
  );
};
