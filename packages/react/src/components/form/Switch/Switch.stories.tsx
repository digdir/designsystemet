import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Fieldset } from '../Fieldset';

import { Switch } from '.';

type Story = StoryObj<typeof Switch>;

export default {
  title: 'Felles/Switch',
  component: Switch,
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Switch',
    disabled: false,
    readOnly: false,
    size: 'medium',
    position: 'left',
    description: 'description',
  },
};

export const FullWidth: StoryFn<typeof Switch> = (args) => (
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

export const FullWidthRight = FullWidth.bind({});

FullWidthRight.args = {
  position: 'right',
};
