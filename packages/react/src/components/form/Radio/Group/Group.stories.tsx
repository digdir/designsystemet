import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Radio } from '../Radio';

import { RadioGroup } from '.';

export default {
  title: 'Kjernekomponenter/Form/Radio/Group',
  component: RadioGroup,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: StoryFn<typeof RadioGroup> = (args) => (
  <RadioGroup {...args}>
    <Radio value='10'>10 - 11</Radio>
    <Radio value='11'>11 - 12</Radio>
    <Radio value='12'>12 - 13</Radio>
  </RadioGroup>
);

Preview.args = {
  legend: 'Velg aktuelt tidspunkt på dagen',
  description: 'Oppmøte 10min før tidspunkt',
  error: '',
  readOnly: false,
  disabled: false,
};
