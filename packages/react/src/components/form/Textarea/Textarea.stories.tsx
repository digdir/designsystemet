import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button, Label, Paragraph } from '../..';

import { Textarea } from '.';

type Story = StoryObj<typeof Textarea>;

export default {
  title: 'Komponenter/Textarea',
  component: Textarea,
  decorators: [
    (Story, { parameters }) => (
      <div
        id='story-render'
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-spacing-2)',
          maxWidth: '100%',
          width: parameters.layout === 'padded' ? '' : '20rem',
        }}
      >
        <style>{'#storybook-root{max-width:100vw}'}</style>
        <Story />
      </div>
    ),
  ],
} as Meta;

export const Preview: Story = {
  args: {
    disabled: false,
    readOnly: false,
    size: 'md',
    cols: 40,
    id: 'my-textarea',
  },
  render: (args) => (
    <>
      <Label htmlFor={args.id}>Label</Label>
      <Textarea {...args} />
    </>
  ),
};

// export const WithCharacterCounter: Story = {
//   args: {
//     cols: 40,
//     characterLimit: {
//       maxCount: 5,
//     },
//   },
//   render: (args) => (
//     <>
//       <Label>Label</Label>
//       <Textarea {...args} />
//     </>
//   ),
// };

export const FullWidth: Story = {
  args: {
    rows: 10,
    cols: 40,
    id: 'my-textarea',
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <>
      <Label htmlFor={args.id}>Label</Label>
      <Textarea {...args} />
    </>
  ),
};

export const Controlled: StoryFn<typeof Textarea> = (args) => {
  const [value, setValue] = useState(`${args.value || ''}`);

  return (
    <>
      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <Label htmlFor={args.id}>Kontroller meg!</Label>
      <Textarea
        cols={40}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        {...args}
      />
      <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
    </>
  );
};

Controlled.args = {
  id: 'my-textarea',
};
