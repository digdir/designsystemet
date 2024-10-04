import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button, Label, Paragraph } from '../..';

import { Textarea } from '.';

type Story = StoryObj<typeof Textarea>;

export default {
  title: 'Komponenter/Textarea',
  component: Textarea,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-spacing-2)',
        }}
      >
        <style>{`#storybook-root{width:20rem;max-width:100vw}`}</style>
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
  },
  render: (args) => (
    <>
      <Label>Label</Label>
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
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <>
      <Label>Label</Label>
      <Textarea {...args} />
    </>
  ),
};

export const Controlled: StoryFn<typeof Textarea> = (args) => {
  const [value, setValue] = useState(`${args.value || ''}`);

  return (
    <>
      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <Label>Kontroller meg!</Label>
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
