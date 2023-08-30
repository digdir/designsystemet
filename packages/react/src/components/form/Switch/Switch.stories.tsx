import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import React from 'react';

import { Fieldset } from '../Fieldset';
import { Checkbox } from '../Checkbox';

import { Switch } from '.';

type Story = StoryObj<typeof Switch>;

export default {
  title: 'Felles/Switch',
  component: Switch,
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Switch',
    description: 'Description',
    disabled: false,
    readOnly: false,
    value: 'value',
  },
};

export const fullWidth: StoryFn<typeof Switch> = (args) => (
  <Fieldset legend='Skru av/på en eller flere alternativer'>
    <Switch
      value='alt1'
      {...args}
    >
      Alternativ 1
    </Switch>
    <Switch
      value='alt1'
      {...args}
    >
      Alternativ 2
    </Switch>
    <Switch
      value='alt1'
      {...args}
    >
      Alternativ 3
    </Switch>
  </Fieldset>
);

export const fullWidthRight = fullWidth.bind({});

fullWidthRight.args = {
  position: 'right',
};
