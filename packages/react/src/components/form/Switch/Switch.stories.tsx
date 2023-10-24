import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Fieldset } from '../Fieldset';

import { Switch } from '.';

type Story = StoryObj<typeof Switch>;

export default {
  title: 'Felles/Switch',
  component: Switch,
} as Meta;

export const Preview: Story = {
  args: {
    disabled: false,
    readOnly: false,
    children: 'Switch',
  },
  decorators: [(Story: StoryFn) => <Story />],
};

export const fullWidth: StoryFn<typeof Switch> = (args) => (
  <Fieldset legend='Skru av/på en eller flere instillinger'>
    <Switch
      value='alt1'
      {...args}
    >
      Instilling 1
    </Switch>
    <Switch
      value='alt1'
      {...args}
    >
      Instilling 2
    </Switch>
    <Switch
      value='alt1'
      {...args}
    >
      Instilling 3
    </Switch>
  </Fieldset>
);

export const fullWidthRight = fullWidth.bind({});

fullWidthRight.args = {
  position: 'right',
};
