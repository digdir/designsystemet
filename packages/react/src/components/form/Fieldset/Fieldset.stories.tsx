import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Fieldset } from '.';

type Story = StoryObj<typeof Fieldset>;

export default {
  title: 'Kjernekomponenter/Form/Fieldset',
  component: Fieldset,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    children: 'You created the Fieldset component!',
  },
};
