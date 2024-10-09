import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import { Button, Label, Paragraph } from '../..';

import { Input } from '.';

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
    <Input.AffixWrapper>
      <Input.Affix>NOK</Input.Affix>
      <Input id='input-html-size' {...args} />
      <Input.Affix>pr.mnd</Input.Affix>
    </Input.AffixWrapper>
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

export const Radio: StoryFn<typeof Input> = (args) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1rem',
    }}
  >
    <style>{'label{display:flex;align-items:center;gap:.5rem}'}</style>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' />
      Default
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' readOnly />
      Read-only
    </Label>
    <Label weight='regular'>
      <Input {...args} />
      Default
    </Label>
    <Label weight='regular'>
      <Input {...args} defaultChecked />
      Checked
    </Label>
    <Label weight='regular'>
      <Input {...args} disabled />
      Disabled
    </Label>
    <Label weight='regular'>
      <Input {...args} aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular'>
      <Input {...args} readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' />
      Default
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' readOnly />
      Read-only
    </Label>
  </div>
);

Radio.args = {
  type: 'radio',
  name: 'radio',
};

export const Checkbox: StoryFn<typeof Input> = (args) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1rem',
    }}
  >
    <style>{'label{display:flex;align-items:center;gap:.5rem}'}</style>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' />
      Default
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' readOnly />
      Read-only
    </Label>
    <Label weight='regular'>
      <Input {...args} />
      Default
    </Label>
    <Label weight='regular'>
      <Input {...args} defaultChecked />
      Checked
    </Label>
    <Label weight='regular'>
      <Input {...args} disabled />
      Disabled
    </Label>
    <Label weight='regular'>
      <Input {...args} aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular'>
      <Input {...args} readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' />
      Default
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' readOnly />
      Read-only
    </Label>
  </div>
);

Checkbox.args = {
  type: 'checkbox',
};

export const Switch: StoryFn<typeof Input> = (args) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1rem',
    }}
  >
    <style>{'label{display:flex;align-items:center;gap:.5rem}'}</style>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' />
      Default
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm' readOnly />
      Read-only
    </Label>
    <Label weight='regular'>
      <Input {...args} />
      Default
    </Label>
    <Label weight='regular'>
      <Input {...args} defaultChecked />
      Checked
    </Label>
    <Label weight='regular'>
      <Input {...args} disabled />
      Disabled
    </Label>
    <Label weight='regular'>
      <Input {...args} aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular'>
      <Input {...args} readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' />
      Default
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg' readOnly />
      Read-only
    </Label>
  </div>
);

Switch.args = {
  type: 'checkbox',
  role: 'switch',
};
