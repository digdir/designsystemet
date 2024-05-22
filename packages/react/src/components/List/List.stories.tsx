import type { Meta, StoryFn } from '@storybook/react';

import { Link } from '../Link';

import { List } from '.';

type Story = StoryFn<typeof List.Root>;

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '5rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Komponenter/List',
  component: List.Root,
  decorators,
} as Meta;

export const Preview: Story = (args) => (
  <List.Root {...args}>
    <List.Heading>List</List.Heading>
    <List.Unordered>
      <List.Item>List Item 1</List.Item>
      <List.Item>List Item 2</List.Item>
      <List.Item>List Item 3</List.Item>
    </List.Unordered>
  </List.Root>
);

Preview.args = {
  size: 'md',
};

export const WithoutHeading: Story = (args) => (
  <List.Root {...args}>
    <List.Unordered>
      <List.Item>Lasagne</List.Item>
      <List.Item>Taco</List.Item>
      <List.Item>Pizza</List.Item>
    </List.Unordered>
  </List.Root>
);

export const Advanced: Story = (args) => (
  <List.Root {...args}>
    <List.Heading level={2}>Nested lists</List.Heading>
    <List.Unordered>
      <List.Item>
        <List.Root>
          <List.Heading level={3}> List Item 1</List.Heading>
          <List.Ordered>
            <List.Item>List Item 1.1</List.Item>
            <List.Item>List Item 1.2</List.Item>
            <List.Item>List Item 1.3</List.Item>
          </List.Ordered>
        </List.Root>
      </List.Item>
      <List.Item>
        <List.Root>
          <List.Heading level={3}> List Item 2</List.Heading>
          <List.Unordered>
            <List.Item>List Item 2.1</List.Item>
            <List.Item>List Item 2.2</List.Item>
            <List.Item>List Item 2.3</List.Item>
          </List.Unordered>
        </List.Root>
      </List.Item>
      <List.Item>List Item 3</List.Item>
    </List.Unordered>
  </List.Root>
);

export const LinkList: Story = (args) => (
  <List.Root {...args}>
    <List.Heading>Designsystemet</List.Heading>
    <List.Unordered
      style={{
        listStyle: 'none',
        paddingLeft: 0,
      }}
    >
      <List.Item>
        <Link
          href='https://www.designsystemet.no/grunnleggende'
          target='_blank'
        >
          Grunnleggende
        </Link>
      </List.Item>
      <List.Item>
        <Link
          href='https://www.designsystemet.no/god-praksis'
          target='_blank'
        >
          God praksis
        </Link>
      </List.Item>
      <List.Item>
        <Link
          href='https://www.designsystemet.no/monstre'
          target='_blank'
        >
          Mønstre
        </Link>
      </List.Item>
    </List.Unordered>
  </List.Root>
);
