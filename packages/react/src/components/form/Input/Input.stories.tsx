import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button, Label, Paragraph } from '../..';

import { Input, InputAddon, InputAddons } from '.';

type Story = StoryObj<typeof Input>;

export default {
  title: 'Komponenter/Input',
  component: Input,
} as Meta;

export const Preview: Story = {
  args: {
    disabled: false,
    readOnly: false,
    size: 'md',
  },
  render: (args) => (
    <>
      <Label htmlFor='input'>Input</Label>
      <Input id='input' {...args} />
    </>
  ),
};
export const HtmlSize: Story = {
  args: {
    htmlSize: 10,
  },
  render: (args) => (
    <>
      <Label htmlFor='input-html-size'>Input with htmlSize</Label>
      <Input id='input-html-size' {...args} />
    </>
  ),
};

export const Adornments: StoryFn<typeof Input> = (args) => (
  <>
    <Label htmlFor='input-html-size'>
      Hvor mange kroner koster det per måned?
    </Label>
    <InputAddons>
      <span aria-hidden='true'>NOK</span>
      <Input id='input-html-size' {...args} />
      <span aria-hidden='true'>pr.mnd</span>
    </InputAddons>
  </>
);

export const Controlled: StoryFn<typeof Input> = (args) => {
  const [value, setValue] = useState<string>();

  return (
    <>
      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          marginTop: 'var(--ds-spacing-2)',
          gap: 'var(--ds-spacing-2)',
        }}
      >
        <div>
          <Label htmlFor='input-controlled'>Kontroller meg!</Label>
          <Input
            id='input-controlled'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...args}
          />
        </div>
        <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
      </div>
    </>
  );
};
