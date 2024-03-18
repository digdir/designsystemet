import type { Meta, StoryFn } from '@storybook/react';

import { Fieldset } from '.';

type Story = StoryFn<typeof Fieldset>;

export default {
  title: 'Komponenter/Fieldset',
  component: Fieldset,
} as Meta;

export const Preview: Story = (args) => <Fieldset {...args}></Fieldset>;
