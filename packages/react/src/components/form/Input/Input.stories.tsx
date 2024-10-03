import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import { Button, Label, Paragraph } from '../..';

import { Input, InputAddons } from '.';

type Story = StoryObj<typeof Input>;

export default {
  title: 'Komponenter/Input',
  component: Input,
  argTypes: {
    // Using argType here to exclude values from React.HTMLInputTypeAttribute
    type: {
      control: 'select',
      options: [
        'checkbox',
        'date',
        'datetime-local',
        'email',
        'month',
        'number',
        'password',
        'radio',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week',
        // 'button',
        // 'color',
        // 'file',
        // 'hidden',
        // 'image',
        // 'range',
        // 'reset',
        // 'submit',
      ],
    },
    role: {
      control: 'radio',
      options: ['checkbox', 'switch'],
      if: { arg: 'type', eq: 'checkbox' },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-spacing-2)',
          flexDirection: 'column',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as Meta;

export const Preview: Story = {
  args: {
    'aria-invalid': false,
    disabled: false,
    readOnly: false,
    size: 'md',
    type: 'text',
    role: 'checkbox',
    name: 'inputs',
  },
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null);
    if (args.role !== 'switch') args.role = undefined; // Ensure we only keep switch role in storybook

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = true;
    });

    return (
      <>
        <Label htmlFor='input-1'>Input 1</Label>
        <Input id='input-1' {...args} />
        <Label htmlFor='input-2'>Input 2</Label>
        <Input id='input-2' {...args} ref={inputRef} />
      </>
    );
  },
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
      <Label htmlFor='input-controlled'>Kontroller meg!</Label>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          marginTop: 'var(--ds-spacing-2)',
          gap: 'var(--ds-spacing-2)',
        }}
      >
        <Input
          id='input-controlled'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...args}
        />
        <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
      </div>
    </>
  );
};
