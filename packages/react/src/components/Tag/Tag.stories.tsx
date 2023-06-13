import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import type { TagProps } from '.';
import { Tag } from '.';

type Story = StoryObj<typeof Tag>;

export default {
  title: 'Kjernekomponenter/Tag',
  component: Tag,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    children: 'New',
    size: 'medium',
    variant: 'outlined',
    color: 'neutral',
  },
};

export const Sizes: StoryFn<typeof Tag> = ({ ...rest }): JSX.Element => {
  const sizes: TagProps['size'][] = ['xsmall', 'small', 'medium'];
  return (
    <StoryContainer row={false}>
      {sizes.map((size) => (
        <Tag
          key={size}
          size={size}
          {...rest}
        >
          {size}
        </Tag>
      ))}
    </StoryContainer>
  );
};

export const Variants: StoryFn<typeof Tag> = ({ ...rest }): JSX.Element => {
  const variants: TagProps['variant'][] = ['filled', 'outlined'];
  return (
    <StoryContainer>
      {variants.map((variant) => (
        <Tag
          key={variant}
          variant={variant}
          {...rest}
        >
          {variant}
        </Tag>
      ))}
    </StoryContainer>
  );
};

export const Colors: StoryFn<typeof Tag> = ({ ...rest }): JSX.Element => {
  const colors: TagProps['color'][] = [
    'neutral',
    'success',
    'warning',
    'danger',
    'info',
    'primary',
    'secondary',
    'tertiary',
  ];
  return (
    <>
      <StoryContainer>
        {colors.map((color) => (
          <Tag
            key={color}
            color={color}
            {...rest}
          >
            {color}
          </Tag>
        ))}
      </StoryContainer>
      <StoryContainer>
        {colors.map((color) => (
          <Tag
            key={color}
            color={color}
            variant='outlined'
            {...rest}
          >
            {color}
          </Tag>
        ))}
      </StoryContainer>
    </>
  );
};

const StoryContainer = ({
  children,
  row = true,
}: {
  children: React.ReactNode;
  row?: boolean;
}) => {
  return (
    <div
      style={{
        display: row ? 'flex' : 'grid',
        gap: '8px',
        marginBottom: '8px',
      }}
    >
      {children}
    </div>
  );
};
