import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import {
  AirplaneFillIcon,
  NewspaperFillIcon,
  BrailleIcon,
  BackpackFillIcon,
  BellFillIcon,
} from '@navikt/aksel-icons';

import { Button } from '../Button';

import { ToggleGroup } from '.';

export default {
  title: 'Komponenter/ToggleGroup',
  component: ToggleGroup,
} as Meta;

export const Preview: StoryFn<typeof ToggleGroup> = (args) => {
  return (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value='Peanut'>Peanut</ToggleGroup.Item>
      <ToggleGroup.Item value='Walnut'>Walnut</ToggleGroup.Item>
      <ToggleGroup.Item value='Pistachio'>Pistachio 🤤</ToggleGroup.Item>
    </ToggleGroup>
  );
};

Preview.args = {
  defaultValue: 'Peanut',
  size: 'md',
  name: 'toggle-group-nuts',
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
        icon={true}
      >
        <BrailleIcon
          title='Braille'
          fontSize='1.5rem'
        />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value={'option-2'}
        icon={true}
      >
        <NewspaperFillIcon
          title='Newspaper'
          fontSize='1.5rem'
        />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value={'option-3'}
        icon={true}
      >
        <BackpackFillIcon
          title='Backpack'
          fontSize='1.5rem'
        />
      </ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const Controlled: StoryFn<typeof ToggleGroup> = () => {
  const [value, setValue] = useState<string>('peanut');
  return (
    <>
      <div style={{ display: 'flex', gap: '4px' }}>
        <Button
          size='sm'
          onClick={() => setValue('peanut')}
        >
          Select Peanut
        </Button>
      </div>
      <br />
      <ToggleGroup
        value={value}
        size='md'
        onChange={setValue}
      >
        <ToggleGroup.Item value='pistachio'>
          <AirplaneFillIcon fontSize='1.5rem' />
          Pistachio
        </ToggleGroup.Item>
        <ToggleGroup.Item value='peanut'>
          <BellFillIcon fontSize='1.5rem' />
          Peanut
        </ToggleGroup.Item>
        <ToggleGroup.Item value='walnut'>
          <NewspaperFillIcon fontSize='1.5rem' />
          Walnut
        </ToggleGroup.Item>
      </ToggleGroup>
      <br />
      <span>You have chosen: {value}</span>
    </>
  );
};
