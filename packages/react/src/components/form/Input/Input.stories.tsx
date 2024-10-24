import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import {
  Button,
  Divider,
  Field,
  Heading,
  Label,
  Paragraph,
  ValidationMessage,
} from '../..';

import { Input } from '.';
import type { Size } from '../../../types';

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
  parameters: {
    a11y: {
      config: {
        // Temporarily disable a11y color-contrast rule for readonly as we need design adjustments on this
        rules: [{ id: 'color-contrast', selector: ':read-only' }],
      },
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    'aria-invalid': false,
    disabled: false,
    readOnly: false,
    'data-size': 'md',
    type: 'text',
    role: 'checkbox',
    name: 'inputs',
  },
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null);
    if (args.role !== 'switch') args.role = undefined; // Ensure we only keep switch role in storybook

    return (
      <Field>
        <Label>Input 1</Label>
        <Input {...args} defaultChecked />
        <ValidationMessage hidden={!args['aria-invalid']}>
          Feilmelding
        </ValidationMessage>
      </Field>
    );
  },
};
export const HtmlSize: Story = {
  args: {
    htmlSize: 10,
  },
  render: (args) => (
    <Field>
      <Label>Input with htmlSize</Label>
      <Input {...args} />
    </Field>
  ),
};

export const Adornments: StoryFn<typeof Input> = (args) => (
  <Field>
    <Label>Hvor mange kroner koster det per måned?</Label>
    <Input.AffixWrapper>
      <Input.Affix>NOK</Input.Affix>
      <Input {...args} />
      <Input.Affix>pr.mnd</Input.Affix>
    </Input.AffixWrapper>
  </Field>
);

export const Controlled: StoryFn<typeof Input> = (args) => {
  const [value, setValue] = useState<string>();

  return (
    <>
      <Field>
        <Label>Kontroller meg!</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...args}
        />
      </Field>
      <div>
        <Divider />

        <Paragraph style={{ margin: 'var(--ds-spacing-2) 0' }}>
          Du har skrevet inn: {value}
        </Paragraph>
        <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
      </div>
    </>
  );
};

const sizes: Size[] = ['sm', 'md', 'lg'];
const sizenames = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
};

export const Text: StoryFn<typeof Input> = (args) => {
  const states = [
    { label: 'Default', props: {} },
    { label: 'Disabled', props: { disabled: true } },
    { label: 'Invalid', props: { 'aria-invalid': 'true' } },
    { label: 'Read-only', props: { readOnly: true } },
  ];

  return (
    <div>
      {sizes.map((size) => (
        <div
          key={size}
          data-size={size}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '90vw',
          }}
        >
          <Heading data-size='2xs' style={{ gridColumn: '1 / -1' }}>
            {sizenames[size]}
          </Heading>
          {states.map((state) => (
            <Field key={state.label}>
              <Label>{state.label}</Label>
              <Input
                {...args}
                name={`${size}-${state.label.toLowerCase()}`}
                {...state.props}
                data-size={size}
              />
              {state.label === 'Invalid' && (
                <ValidationMessage>Feilmelding</ValidationMessage>
              )}
            </Field>
          ))}
        </div>
      ))}
    </div>
  );
};

Text.args = {
  value: 'Value',
};

export const Radio: StoryFn<typeof Input> = (args) => {
  const states = [
    { label: 'Default', props: {} },
    { label: 'Checked', props: { defaultChecked: true } },
    { label: 'Disabled', props: { disabled: true } },
    {
      label: 'Disabled checked',
      props: { disabled: true, defaultChecked: true },
    },
    { label: 'Invalid', props: { 'aria-invalid': 'true' } },
    {
      label: 'Invalid checked',
      props: { 'aria-invalid': 'true', defaultChecked: true },
    },
    { label: 'Read-only', props: { readOnly: true } },
    {
      label: 'Read-only checked',
      props: { readOnly: true, defaultChecked: true },
    },
  ];

  return (
    <div>
      {sizes.map((size) => (
        <div
          key={size}
          data-size={size}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            maxWidth: '90vw',
          }}
        >
          <Heading
            data-size='2xs'
            style={{ gridColumn: '1 / -1', marginTop: 16 }}
          >
            {sizenames[size]}
          </Heading>
          {states.map((state) => (
            <Field key={state.label}>
              <Input
                {...args}
                name={`${size}-${state.label.toLowerCase().replace(' ', '-')}`}
                {...state.props}
              />
              <Label>{state.label}</Label>
            </Field>
          ))}
        </div>
      ))}
    </div>
  );
};

Radio.args = {
  type: 'radio',
};

export const Checkbox: StoryFn<typeof Input> = function Render(args) {
  useEffect(() => {
    for (const input of document.getElementsByTagName('input')) {
      if (input.hasAttribute('data-indeterminate')) input.indeterminate = true;
    }
  }); // Intentionally run on every render

  const states = [
    { label: 'Default', props: {} },
    { label: 'Checked', props: { defaultChecked: true } },
    { label: 'Indeterminate', props: { 'data-indeterminate': true } },
    { label: 'Disabled', props: { disabled: true } },
    {
      label: 'Disabled checked',
      props: { disabled: true, defaultChecked: true },
    },
    {
      label: 'Disabled indeterminate',
      props: { disabled: true, 'data-indeterminate': true },
    },
    { label: 'Invalid', props: { 'aria-invalid': 'true' } },
    {
      label: 'Invalid checked',
      props: { 'aria-invalid': 'true', defaultChecked: true },
    },
    {
      label: 'Invalid indeterminate',
      props: { 'aria-invalid': 'true', 'data-indeterminate': true },
    },
    { label: 'Read-only', props: { readOnly: true } },
    {
      label: 'Read-only checked',
      props: { readOnly: true, defaultChecked: true },
    },
    {
      label: 'Read-only indeterminate',
      props: { readOnly: true, 'data-indeterminate': true },
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gap: '2rem',
      }}
    >
      {sizes.map((size) => (
        <div
          key={size}
          data-size={size}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          <Heading data-size='2xs' style={{ gridColumn: '1 / -1' }}>
            {sizenames[size]}
          </Heading>
          {states.map((state) => (
            <Field key={state.label}>
              <Input
                {...args}
                name={`${size}-${state.label.toLowerCase().replace(' ', '-')}`}
                {...state.props}
              />
              <Label>{state.label}</Label>
            </Field>
          ))}
        </div>
      ))}
    </div>
  );
};

Checkbox.args = {
  type: 'checkbox',
};

export const Switch: StoryFn<typeof Input> = (args) => {
  const states = [
    { label: 'Default', props: {} },
    { label: 'Checked', props: { defaultChecked: true } },
    { label: 'Disabled', props: { disabled: true } },
    {
      label: 'Disabled checked',
      props: { disabled: true, defaultChecked: true },
    },
    /* { label: 'Invalid', props: { 'aria-invalid': 'true' } },
    {
      label: 'Invalid checked',
      props: { 'aria-invalid': 'true', defaultChecked: true },
    }, */
    { label: 'Read-only', props: { readOnly: true } },
    {
      label: 'Read-only checked',
      props: { readOnly: true, defaultChecked: true },
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gap: '2rem',
      }}
    >
      {sizes.map((size) => (
        <div
          key={size}
          data-size={size}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            maxWidth: '90vw',
          }}
        >
          <Heading data-size='2xs' style={{ gridColumn: '1 / -1' }}>
            {sizenames[size]}
          </Heading>
          {states.map((state) => (
            <Field key={state.label}>
              <Input
                {...args}
                name={`${size}-${state.label.toLowerCase().replace(' ', '-')}`}
                {...state.props}
              />
              <Label>{state.label}</Label>
            </Field>
          ))}
        </div>
      ))}
    </div>
  );
};

Switch.args = {
  type: 'checkbox',
  role: 'switch',
};
