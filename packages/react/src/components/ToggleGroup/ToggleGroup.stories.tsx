import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import * as icons from '@navikt/aksel-icons';

import { Button } from '../Button';

import { ToggleGroup } from '.';

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
const AkselIcon3 = icons.BrailleIcon;
const AkselIcon4 = icons.BackpackFillIcon;

export default {
  title: 'Felles/ToggleGroup',
  component: ToggleGroup,
} as Meta;

export const Preview: StoryFn<typeof ToggleGroup> = (args) => {
  return (
    <ToggleGroup
      {...args}
      defaultValue='Peanut'
    >
      <ToggleGroup.Item>Peanut</ToggleGroup.Item>
      <ToggleGroup.Item>Walnut</ToggleGroup.Item>
      <ToggleGroup.Item>Pistachio 🤤</ToggleGroup.Item>
    </ToggleGroup>
  );
};

Preview.args = {
  size: 'medium',
  defaultValue: 'test',
};

export const OnlyIcons: StoryFn<typeof ToggleGroup> = () => {
  const handleChange = (value: string) => {
    console.log(value);
  };

  return (
    <ToggleGroup
      defaultValue={'option-1'}
      onChange={handleChange}
    >
      <ToggleGroup.Item
        value={'option-1'}
        icon={<AkselIcon3 />}
      />
      <ToggleGroup.Item
        value={'option-2'}
        icon={<AkselIcon2 />}
      />
      <ToggleGroup.Item
        value={'option-3'}
        icon={<AkselIcon4 />}
      />
    </ToggleGroup>
  );
};

export const Uncontrolled: StoryFn<typeof ToggleGroup> = () => {
  const handleChange = (value: string) => {
    console.log(value);
  };

  return (
    <ToggleGroup
      defaultValue={'Pistachio'}
      onChange={handleChange}
    >
      <ToggleGroup.Item icon={<AkselIcon />}>Pistachio</ToggleGroup.Item>
      <ToggleGroup.Item icon={icon}>Peanut</ToggleGroup.Item>
      <ToggleGroup.Item icon={<AkselIcon2 />}>Walnut</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const Controlled: StoryFn<typeof ToggleGroup> = () => {
  const [value, setValue] = useState<string>('peanut');
  return (
    <>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button
          size='small'
          onClick={() => setValue('peanut')}
        >
          Activate middle button!
        </Button>
      </div>
      <br />
      <ToggleGroup
        value={value}
        size='medium'
        onChange={setValue}
      >
        <ToggleGroup.Item
          value='pistachio'
          icon={<AkselIcon />}
        >
          Pistachio
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value='peanut'
          icon={icon}
        >
          Peanut
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value='walnut'
          icon={<AkselIcon2 />}
        >
          Walnut
        </ToggleGroup.Item>
      </ToggleGroup>
      <br />
      <span>Du har valgt: {value}</span>
    </>
  );
};
