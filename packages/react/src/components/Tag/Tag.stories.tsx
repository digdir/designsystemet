import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import type { TagProps } from '.';
import { Tag } from '.';

type Story = StoryObj<typeof Tag>;

export default {
  title: 'Komponenter/Tag',
  component: Tag,
  parameters: {
    customStyles: { justifyContent: 'start' },
  },
} satisfies Meta;

export const Preview: Story = {
  args: {
    children: 'New',
    size: 'md',
    color: 'neutral',
  },
};

const sizes: TagProps['size'][] = ['sm', 'md', 'lg'];
export const Sizes: StoryFn<typeof Tag> = ({ ...rest }): JSX.Element => {
  return (
    <>
      {sizes.map((size) => (
        <Tag key={size} size={size} {...rest}>
          {size}
        </Tag>
      ))}
    </>
  );
};

const colors: TagProps['color'][] = [
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
  'brand1',
  'brand2',
  'brand3',
];

export const Colors: StoryFn<typeof Tag> = ({ ...rest }): JSX.Element => {
  return (
    <>
      {colors.map((color) => (
        <Tag key={color} color={color} {...rest}>
          {color}
        </Tag>
      ))}
    </>
  );
};
