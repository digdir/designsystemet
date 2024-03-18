import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import * as icons from '@navikt/aksel-icons';

import { Button } from '../Button';

import { ToggleGroup } from '.';

const AkselIcon = icons.AirplaneFillIcon;
const AkselIcon2 = icons.NewspaperFillIcon;
const AkselIcon3 = icons.BrailleIcon;
const AkselIcon4 = icons.BackpackFillIcon;
const AkselIcon5 = icons.BellFillIcon;

export default {
  title: 'Komponenter/ToggleGroup',
  component: ToggleGroup,
} as Meta;

export const Preview: StoryFn<typeof ToggleGroup> = (args) => {
  return (
    <ToggleGroup {...args}>
      <ToggleGroup.Item>Peanut</ToggleGroup.Item>
      <ToggleGroup.Item>Walnut</ToggleGroup.Item>
      <ToggleGroup.Item>Pistachio 🤤</ToggleGroup.Item>
    </ToggleGroup>
  );
};

Preview.args = {
  defaultValue: 'Peanut',
  size: 'medium',
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
        <AkselIcon3
          title='Braille'
          fontSize='1.5rem'
        />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value={'option-2'}
        icon={true}
      >
        <AkselIcon2
          title='Newspaper'
          fontSize='1.5rem'
        />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        value={'option-3'}
        icon={true}
      >
        <AkselIcon4
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
          size='small'
          onClick={() => setValue('peanut')}
        >
          Select Peanut
        </Button>
      </div>
      <br />
      <ToggleGroup
        value={value}
        size='medium'
        onChange={setValue}
      >
        <ToggleGroup.Item value='pistachio'>
          <AkselIcon fontSize='1.5rem' />
          Pistachio
        </ToggleGroup.Item>
        <ToggleGroup.Item value='peanut'>
          <AkselIcon5 fontSize='1.5rem' />
          Peanut
        </ToggleGroup.Item>
        <ToggleGroup.Item value='walnut'>
          <AkselIcon2 fontSize='1.5rem' />
          Walnut
        </ToggleGroup.Item>
      </ToggleGroup>
      <br />
      <span>You have chosen: {value}</span>
    </>
  );
};
