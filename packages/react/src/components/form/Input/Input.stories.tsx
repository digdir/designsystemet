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
    size: 'md',
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

export const Text: StoryFn<typeof Input> = (args) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem',
      maxWidth: '90vw',
    }}
  >
    <Heading size='2xs' style={{ gridColumn: '1 / -1' }}>
      Small
    </Heading>
    <Field>
      <Label size='sm'>Default</Label>
      <Input {...args} size='sm' name='sm-default' />
    </Field>
    <Field>
      <Label size='sm'>Disabled</Label>
      <Input {...args} size='sm' name='sm-disabled' disabled />
    </Field>
    <Field>
      <Label size='sm'>Invalid</Label>
      <Input {...args} size='sm' name='sm-invalid' aria-invalid='true' />
      <ValidationMessage>Feilmelding</ValidationMessage>
    </Field>
    <Field>
      <Label size='sm'>Read-only</Label>
      <Input {...args} size='sm' name='sm-readonly' readOnly />
    </Field>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Medium
    </Heading>
    <Field>
      <Label size='md'>Default</Label>
      <Input {...args} size='md' name='md-default' />
    </Field>
    <Field>
      <Label size='md'>Disabled</Label>
      <Input {...args} size='md' name='md-disabled' disabled />
    </Field>
    <Field>
      <Label size='md'>Invalid</Label>
      <Input {...args} size='md' name='md-invalid' aria-invalid='true' />
      <ValidationMessage>Feilmelding</ValidationMessage>
    </Field>
    <Field>
      <Label size='md'>Read-only</Label>
      <Input {...args} size='md' name='md-readonly' readOnly />
    </Field>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Large
    </Heading>
    <Field>
      <Label size='lg'>Default</Label>
      <Input {...args} size='lg' name='lg-default' />
    </Field>
    <Field>
      <Label size='lg'>Disabled</Label>
      <Input {...args} size='lg' name='lg-disabled' disabled />
    </Field>
    <Field>
      <Label size='lg'>Invalid</Label>
      <Input {...args} size='lg' name='lg-invalid' aria-invalid='true' />
      <ValidationMessage>Feilmelding</ValidationMessage>
    </Field>
    <Field>
      <Label size='lg'>Read-only</Label>
      <Input {...args} size='lg' name='lg-readonly' readOnly />
    </Field>
  </div>
);

Text.args = {
  value: 'Value',
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
    <Heading size='2xs' style={{ gridColumn: '1 / -1' }}>
      Small
    </Heading>
    <Field>
      <Input {...args} size='sm' name='sm-default' />
      <Label size='sm'>Default</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-default' defaultChecked />
      <Label size='sm'>Checked</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-disabled' disabled />
      <Label size='sm'>Disabled</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-disabled' disabled defaultChecked />
      <Label size='sm'>Disabled checked</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-invalid' aria-invalid='true' />
      <Label size='sm'>Invalid</Label>
    </Field>
    <Field>
      <Input
        {...args}
        size='sm'
        name='sm-invalid'
        aria-invalid='true'
        defaultChecked
      />
      <Label size='sm'>Invalid checked</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-readonly' readOnly />
      <Label size='sm'>Read-only</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-readonly' readOnly defaultChecked />
      <Label size='sm'>Read-only checked</Label>
    </Field>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Medium
    </Heading>
    <Field>
      <Input {...args} size='md' name='md-default' />
      <Label size='md'>Default</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-default' defaultChecked />
      <Label size='md'>Checked</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-disabled' disabled />
      <Label size='md'>Disabled</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-disabled' disabled defaultChecked />
      <Label size='md'>Disabled checked</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-invalid' aria-invalid='true' />
      <Label size='md'>Invalid</Label>
    </Field>
    <Field>
      <Input
        {...args}
        size='md'
        name='md-invalid'
        aria-invalid='true'
        defaultChecked
      />
      <Label size='md'>Invalid checked</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-readonly' readOnly />
      <Label size='md'>Read-only</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-readonly' readOnly defaultChecked />
      <Label size='md'>Read-only checked</Label>
    </Field>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Large
    </Heading>
    <Field>
      <Input {...args} size='lg' name='lg-default' />
      <Label size='lg'>Default</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-default' defaultChecked />
      <Label size='lg'>Checked</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-disabled' disabled />
      <Label size='lg'>Disabled</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-disabled' disabled defaultChecked />
      <Label size='lg'>Disabled checked</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-invalid' aria-invalid='true' />
      <Label size='lg'>Invalid</Label>
    </Field>
    <Field>
      <Input
        {...args}
        size='lg'
        name='lg-invalid'
        aria-invalid='true'
        defaultChecked
      />
      <Label size='lg'>Invalid checked</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-readonly' readOnly />
      <Label size='lg'>Read-only</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-readonly' readOnly defaultChecked />
      <Label size='lg'>Read-only checked</Label>
    </Field>
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
      <Heading size='2xs' style={{ gridColumn: '1 / -1' }}>
        Small
      </Heading>
      <Field>
        <Input {...args} size='sm' name='sm-default' />
        <Label size='sm'>Default</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-default' defaultChecked />
        <Label size='sm'>Checked</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-default' data-indeterminate />
        <Label size='sm'>Indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-disabled' disabled />
        <Label size='sm'>Disabled</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-disabled' disabled defaultChecked />
        <Label size='sm'>Disabled checked</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-default' data-indeterminate />
        <Label size='sm'>Disabled indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-invalid' aria-invalid='true' />
        <Label size='sm'>Invalid</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='sm'
          name='sm-invalid'
          aria-invalid='true'
          defaultChecked
        />
        <Label size='sm'>Invalid checked</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='sm'
          name='sm-default'
          aria-invalid='true'
          data-indeterminate
        />
        <Label size='sm'>Invalid indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-readonly' readOnly />
        <Label size='sm'>Read-only</Label>
      </Field>
      <Field>
        <Input {...args} size='sm' name='sm-readonly' readOnly defaultChecked />
        <Label size='sm'>Read-only checked</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='sm'
          name='sm-default'
          readOnly
          data-indeterminate
        />
        <Label size='sm'>Read-only indeterminate</Label>
      </Field>
      <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
        Medium
      </Heading>
      <Field>
        <Input {...args} size='md' name='md-default' />
        <Label size='md'>Default</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-default' defaultChecked />
        <Label size='md'>Checked</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-default' data-indeterminate />
        <Label size='md'>Indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-disabled' disabled />
        <Label size='md'>Disabled</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-disabled' disabled defaultChecked />
        <Label size='md'>Disabled checked</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-default' data-indeterminate />
        <Label size='md'>Disabled indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-invalid' aria-invalid='true' />
        <Label size='md'>Invalid</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='md'
          name='md-invalid'
          aria-invalid='true'
          defaultChecked
        />
        <Label size='md'>Invalid checked</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='md'
          name='md-default'
          aria-invalid='true'
          data-indeterminate
        />
        <Label size='md'>Invalid indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-readonly' readOnly />
        <Label size='md'>Read-only</Label>
      </Field>
      <Field>
        <Input {...args} size='md' name='md-readonly' readOnly defaultChecked />
        <Label size='md'>Read-only checked</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='md'
          name='md-default'
          readOnly
          data-indeterminate
        />
        <Label size='md'>Read-only indeterminate</Label>
      </Field>
      <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
        Large
      </Heading>
      <Field>
        <Input {...args} size='lg' name='lg-default' />
        <Label size='lg'>Default</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-default' defaultChecked />
        <Label size='lg'>Checked</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-default' data-indeterminate />
        <Label size='lg'>Indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-disabled' disabled />
        <Label size='lg'>Disabled</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-disabled' disabled defaultChecked />
        <Label size='lg'>Disabled checked</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-default' data-indeterminate />
        <Label size='lg'>Disabled indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-invalid' aria-invalid='true' />
        <Label size='lg'>Invalid</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='lg'
          name='lg-invalid'
          aria-invalid='true'
          defaultChecked
        />
        <Label size='lg'>Invalid checked</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='lg'
          name='lg-default'
          aria-invalid='true'
          data-indeterminate
        />
        <Label size='lg'>Invalid indeterminate</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-readonly' readOnly />
        <Label size='lg'>Read-only</Label>
      </Field>
      <Field>
        <Input {...args} size='lg' name='lg-readonly' readOnly defaultChecked />
        <Label size='lg'>Read-only checked</Label>
      </Field>
      <Field>
        <Input
          {...args}
          size='lg'
          name='lg-default'
          readOnly
          data-indeterminate
        />
        <Label size='lg'>Read-only indeterminate</Label>
      </Field>
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
    <Heading size='2xs' style={{ gridColumn: '1 / -1' }}>
      Small
    </Heading>
    <Field>
      <Input {...args} size='sm' name='sm-default' />
      <Label size='sm'>Default</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-default' defaultChecked />
      <Label size='sm'>Checked</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-disabled' disabled />
      <Label size='sm'>Disabled</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-disabled' disabled defaultChecked />
      <Label size='sm'>Disabled checked</Label>
    </Field>
    {/* <Field>
      <Input {...args} size='sm' name='sm-invalid' aria-invalid='true' />
      <Label size='sm'>Invalid</Label>
    </Field>
    <Field>
      <Input
        {...args}
        size='sm'
        name='sm-invalid'
        aria-invalid='true'
        defaultChecked
      />
      <Label size='sm'>Invalid checked</Label>
    </Field> */}
    <Field>
      <Input {...args} size='sm' name='sm-readonly' readOnly />
      <Label size='sm'>Read-only</Label>
    </Field>
    <Field>
      <Input {...args} size='sm' name='sm-readonly' readOnly defaultChecked />
      <Label size='sm'>Read-only checked</Label>
    </Field>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Medium
    </Heading>
    <Field>
      <Input {...args} size='md' name='md-default' />
      <Label size='md'>Default</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-default' defaultChecked />
      <Label size='md'>Checked</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-disabled' disabled />
      <Label size='md'>Disabled</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-disabled' disabled defaultChecked />
      <Label size='md'>Disabled checked</Label>
    </Field>
    {/* <Field>
      <Input {...args} size='md' name='md-invalid' aria-invalid='true' />
      <Label size='md'>Invalid</Label>
    </Field>
    <Field>
      <Input
        {...args}
        size='md'
        name='md-invalid'
        aria-invalid='true'
        defaultChecked
      />
      <Label size='md'>Invalid checked</Label>
    </Field> */}
    <Field>
      <Input {...args} size='md' name='md-readonly' readOnly />
      <Label size='md'>Read-only</Label>
    </Field>
    <Field>
      <Input {...args} size='md' name='md-readonly' readOnly defaultChecked />
      <Label size='md'>Read-only checked</Label>
    </Field>
    <Heading size='2xs' style={{ gridColumn: '1 / -1', marginTop: 16 }}>
      Large
    </Heading>
    <Field>
      <Input {...args} size='lg' name='lg-default' />
      <Label size='lg'>Default</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-default' defaultChecked />
      <Label size='lg'>Checked</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-disabled' disabled />
      <Label size='lg'>Disabled</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-disabled' disabled defaultChecked />
      <Label size='lg'>Disabled checked</Label>
    </Field>
    {/* <Field>
      <Input {...args} size='lg' name='lg-invalid' aria-invalid='true' />
      <Label size='lg'>Invalid</Label>
    </Field>
    <Field>
      <Input
        {...args}
        size='lg'
        name='lg-invalid'
        aria-invalid='true'
        defaultChecked
      />
      <Label size='lg'>Invalid checked</Label>
    </Field> */}
    <Field>
      <Input {...args} size='lg' name='lg-readonly' readOnly />
      <Label size='lg'>Read-only</Label>
    </Field>
    <Field>
      <Input {...args} size='lg' name='lg-readonly' readOnly defaultChecked />
      <Label size='lg'>Read-only checked</Label>
    </Field>
  </div>
);

Switch.args = {
  type: 'checkbox',
  role: 'switch',
};
