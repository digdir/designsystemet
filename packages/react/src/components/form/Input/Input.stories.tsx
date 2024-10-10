import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import { Button, Heading, Label, Paragraph, ValidationMessage } from '../..';

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
        <ValidationMessage hidden={!args['aria-invalid']}>
          Feilmelding
        </ValidationMessage>
        <Label htmlFor='input-2'>Input 2</Label>
        <Input id='input-2' {...args} ref={inputRef} />
        <ValidationMessage hidden={!args['aria-invalid']}>
          Feilmelding
        </ValidationMessage>
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
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      maxWidth: '90vw',
    }}
  >
    <style>{'label{display:flex;align-items:center;gap:.5rem}'}</style>
    <Heading size='2xs' style={{ gridColumn: '1 / -1' }}>
      Small
    </Heading>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-default' />
      Default
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-default' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-disabled' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-disabled' disabled defaultChecked />
      Disabled checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-invalid' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='sm'>
      <Input
        {...args}
        size='sm'
        name='sm-invalid'
        aria-invalid='true'
        defaultChecked
      />
      Invalid checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-readonly' readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-readonly' readOnly defaultChecked />
      Read-only checked
    </Label>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Medium
    </Heading>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-default' />
      Default
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-default' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-disabled' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-disabled' disabled defaultChecked />
      Disabled checked
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-invalid' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='md'>
      <Input
        {...args}
        size='md'
        name='md-invalid'
        aria-invalid='true'
        defaultChecked
      />
      Invalid checked
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-readonly' readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-readonly' readOnly defaultChecked />
      Read-only checked
    </Label>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Large
    </Heading>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-default' />
      Default
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-default' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-disabled' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-disabled' disabled defaultChecked />
      Disabled checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-invalid' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='lg'>
      <Input
        {...args}
        size='lg'
        name='lg-invalid'
        aria-invalid='true'
        defaultChecked
      />
      Invalid checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-readonly' readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-readonly' readOnly defaultChecked />
      Read-only checked
    </Label>
  </div>
);

Radio.args = {
  type: 'radio',
};

export const Checkbox: StoryFn<typeof Input> = function Render(args) {
  useEffect(() => {
    for (const input of document.getElementsByTagName('input')) {
      if (input.hasAttribute('data-indeterminate')) input.indeterminate = true;
    }
  }); // Intentionally run on every render

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
      }}
    >
      <style>{'label{display:flex;align-items:center;gap:.5rem}'}</style>
      <Heading size='2xs' style={{ gridColumn: '1 / -1' }}>
        Small
      </Heading>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-default' />
        Default
      </Label>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-default' defaultChecked />
        Checked
      </Label>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-default' data-indeterminate />
        Indeterminate
      </Label>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-disabled' disabled />
        Disabled
      </Label>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-disabled' disabled defaultChecked />
        Disabled checked
      </Label>
      <Label weight='regular' size='sm'>
        <Input
          {...args}
          size='sm'
          name='sm-disabled'
          disabled
          data-indeterminate
        />
        Disabled indeterminate
      </Label>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-invalid' aria-invalid='true' />
        Invalid
      </Label>
      <Label weight='regular' size='sm'>
        <Input
          {...args}
          size='sm'
          name='sm-invalid'
          aria-invalid='true'
          defaultChecked
        />
        Invalid checked
      </Label>
      <Label weight='regular' size='sm'>
        <Input
          {...args}
          size='sm'
          name='sm-invalid'
          aria-invalid='true'
          data-indeterminate
        />
        Invalid indeterminate
      </Label>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-readonly' readOnly />
        Read-only
      </Label>
      <Label weight='regular' size='sm'>
        <Input {...args} size='sm' name='sm-readonly' readOnly defaultChecked />
        Read-only checked
      </Label>
      <Label weight='regular' size='sm'>
        <Input
          {...args}
          size='sm'
          name='sm-readonly'
          readOnly
          data-indeterminate
        />
        Read-only indeterminate
      </Label>
      <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
        Medium
      </Heading>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-default' />
        Default
      </Label>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-default' defaultChecked />
        Checked
      </Label>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-default' data-indeterminate />
        Indeterminate
      </Label>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-disabled' disabled />
        Disabled
      </Label>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-disabled' disabled defaultChecked />
        Disabled checked
      </Label>
      <Label weight='regular' size='md'>
        <Input
          {...args}
          size='md'
          name='md-disabled'
          disabled
          data-indeterminate
        />
        Disabled indeterminate
      </Label>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-invalid' aria-invalid='true' />
        Invalid
      </Label>
      <Label weight='regular' size='md'>
        <Input
          {...args}
          size='md'
          name='md-invalid'
          aria-invalid='true'
          defaultChecked
        />
        Invalid checked
      </Label>
      <Label weight='regular' size='md'>
        <Input
          {...args}
          size='md'
          name='md-invalid'
          aria-invalid='true'
          data-indeterminate
        />
        Invalid indeterminate
      </Label>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-readonly' readOnly />
        Read-only
      </Label>
      <Label weight='regular' size='md'>
        <Input {...args} size='md' name='md-readonly' readOnly defaultChecked />
        Read-only checked
      </Label>
      <Label weight='regular' size='md'>
        <Input
          {...args}
          size='md'
          name='md-readonly'
          readOnly
          data-indeterminate
        />
        Read-only indeterminate
      </Label>
      <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
        Large
      </Heading>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-default' />
        Default
      </Label>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-default' defaultChecked />
        Checked
      </Label>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-default' data-indeterminate />
        Indeterminate
      </Label>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-disabled' disabled />
        Disabled
      </Label>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-disabled' disabled defaultChecked />
        Disabled checked
      </Label>
      <Label weight='regular' size='lg'>
        <Input
          {...args}
          size='lg'
          name='lg-disabled'
          disabled
          data-indeterminate
        />
        Disabled indeterminate
      </Label>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-invalid' aria-invalid='true' />
        Invalid
      </Label>
      <Label weight='regular' size='lg'>
        <Input
          {...args}
          size='lg'
          name='lg-invalid'
          aria-invalid='true'
          defaultChecked
        />
        Invalid checked
      </Label>
      <Label weight='regular' size='lg'>
        <Input
          {...args}
          size='lg'
          name='lg-invalid'
          aria-invalid='true'
          data-indeterminate
        />
        Invalid indeterminate
      </Label>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-readonly' readOnly />
        Read-only
      </Label>
      <Label weight='regular' size='lg'>
        <Input {...args} size='lg' name='lg-readonly' readOnly defaultChecked />
        Read-only checked
      </Label>
      <Label weight='regular' size='lg'>
        <Input
          {...args}
          size='lg'
          name='lg-readonly'
          readOnly
          data-indeterminate
        />
        Read-only indeterminate
      </Label>
    </div>
  );
};

Checkbox.args = {
  type: 'checkbox',
};

export const Switch: StoryFn<typeof Input> = (args) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      maxWidth: '90vw',
    }}
  >
    <style>{'label{display:flex;align-items:center;gap:.5rem}'}</style>
    <Heading size='2xs' style={{ gridColumn: '1 / -1' }}>
      Small
    </Heading>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-default' />
      Default
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-default' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-disabled' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-disabled' disabled defaultChecked />
      Disabled checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-invalid' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='sm'>
      <Input
        {...args}
        size='sm'
        name='sm-invalid'
        aria-invalid='true'
        defaultChecked
      />
      Invalid checked
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-readonly' readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='sm'>
      <Input {...args} size='sm' name='sm-readonly' readOnly defaultChecked />
      Read-only checked
    </Label>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Medium
    </Heading>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-default' />
      Default
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-default' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-disabled' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-disabled' disabled defaultChecked />
      Disabled checked
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-invalid' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='md'>
      <Input
        {...args}
        size='md'
        name='md-invalid'
        aria-invalid='true'
        defaultChecked
      />
      Invalid checked
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-readonly' readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='md'>
      <Input {...args} size='md' name='md-readonly' readOnly defaultChecked />
      Read-only checked
    </Label>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Large
    </Heading>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-default' />
      Default
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-default' defaultChecked />
      Checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-disabled' disabled />
      Disabled
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-disabled' disabled defaultChecked />
      Disabled checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-invalid' aria-invalid='true' />
      Invalid
    </Label>
    <Label weight='regular' size='lg'>
      <Input
        {...args}
        size='lg'
        name='lg-invalid'
        aria-invalid='true'
        defaultChecked
      />
      Invalid checked
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-readonly' readOnly />
      Read-only
    </Label>
    <Label weight='regular' size='lg'>
      <Input {...args} size='lg' name='lg-readonly' readOnly defaultChecked />
      Read-only checked
    </Label>
  </div>
);

Switch.args = {
  type: 'checkbox',
  role: 'switch',
};
