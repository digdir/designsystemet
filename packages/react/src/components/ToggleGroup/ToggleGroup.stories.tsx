import React, { useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import * as icons from '@navikt/aksel-icons';

import { ToggleGroup } from '.';

type Story = StoryObj<typeof ToggleGroup>;

const icon = (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm5.047 5.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z'
      fill='currentColor'
    />
  </svg>
);

const AkselIcon = icons.AirplaneFillIcon;
const AkselIcon2 = icons.NewspaperFillIcon;

export default {
  title: 'Felles/ToggleGroup',
  component: ToggleGroup,
} as Meta;

// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: Story = {
  args: {
    children: 'You created the ToggleGroup component!',
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Controlled: StoryFn<typeof ToggleGroup> = () => {
  const [value, setValue] = useState<string>('test2');
  return (
    <ToggleGroup
      value={value}
      defaultValue={'test'}
      size='medium'
      onChange={setValue}
    >
      <ToggleGroup.Item
        value='test'
        icon={<AkselIcon />}
      >
        Test
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value='test2'
        icon={icon}
      >
        Test
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value='test3'
        icon={<AkselIcon2 />}
      >
        Test Test
      </ToggleGroup.Item>
    </ToggleGroup>
  );
};
