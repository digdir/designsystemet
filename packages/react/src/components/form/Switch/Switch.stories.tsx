import type { Meta, StoryObj } from '@storybook/react';

import { Fieldset } from '../Fieldset';

import { Switch } from '.';

type Story = StoryObj<typeof Switch>;

export default {
  title: 'Komponenter/Switch',
  component: Switch,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Switch',
    disabled: false,
    readOnly: false,
    'data-size': 'md',
    // position: 'left',
    description: '',
  },
};

export const Checked: Story = {
  ...Preview,
  args: { ...Preview.args, checked: true },
};

export const Group: Story = {
  render: ({ 'aria-label': a, 'aria-labelledby': b, ...args }) => (
    <Fieldset>
      <Fieldset.Legend>Skru av/på en eller flere innstillinger</Fieldset.Legend>
      <Switch
        label='Innstilling 1'
        description='Beskrivelse av innstilling'
        value='alt1'
        checked
        {...args}
      />
      <Switch label='Innstilling 2' value='alt2' {...args} />
      <Switch
        label='Innstilling 3'
        value='alt3'
        description='Velg innstilling 2 for å aktivere'
        disabled
        {...args}
      />
      <Switch
        label='Innstilling 4'
        value='alt4'
        description='Du mangler rettigheter for denne instillingen'
        readOnly
        {...args}
      />
    </Fieldset>
  ),
};

export const GroupEnd: Story = {
  ...Group,
  args: {
    position: 'end',
  },
};
