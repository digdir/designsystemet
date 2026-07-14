import { useState } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';

import { Button, Divider, Label, Paragraph } from '../../';

import { Textarea } from './textarea';

const meta = preview.meta({
  title: 'Komponenter/Textarea',
  component: Textarea,
  decorators: [
    (Story, { parameters }) => (
      <div
        id='story-render'
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-size-2)',
          maxWidth: '100%',
          width: parameters.layout === 'padded' ? '' : '20rem',
        }}
      >
        <style>{'#storybook-root{max-width:100vw}'}</style>
        <Story />
      </div>
    ),
  ],
});

export const Preview = meta.story({
  args: {
    disabled: false,
    readOnly: false,
    cols: 40,
    id: 'my-textarea',
  },
  render: (args) => (
    <>
      <Label htmlFor={args.id}>Label</Label>
      <Textarea {...args} />
    </>
  ),
});

export const FullWidth = meta.story({
  args: {
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
});

export const Controlled = meta.story({
  render: (args) => {
    const [value, setValue] = useState(`${args.value || ''}`);

    return (
      <>
        <Label htmlFor={args.id}>Kontroller meg!</Label>
        <Textarea
          cols={40}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          {...args}
        />

        <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

        <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
          Du har skrevet inn: {value}
        </Paragraph>
        <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
      </>
    );
  },

  args: {
    id: 'my-textarea',
  },

  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
});
