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
    <Radio value='vanilje'>Vanilje</Radio>
    <Radio value='jordbær'>Jordbær</Radio>
    <Radio value='sjokolade'>Sjokolade</Radio>
    <Radio value='spiser-ikke-is'>Jeg spiser ikke iskrem</Radio>
  </RadioGroup>
);

Preview.args = {
  legend: 'Hvilken iskremsmak er best?',
  description: 'Velg din favorittsmak blant alternativene.',
  readOnly: false,
  disabled: false,
  error: '',
};
