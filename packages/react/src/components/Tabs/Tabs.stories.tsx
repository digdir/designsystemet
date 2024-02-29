import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import * as icons from '@navikt/aksel-icons';

import { Button } from '../Button';

import { Tabs } from '.';

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

const AkselIcon = icons.AirplaneIcon;
const AkselIcon2 = icons.NewspaperIcon;
const AkselIcon3 = icons.DogIcon;
const AkselIcon4 = icons.BackpackIcon;

export default {
  title: 'Komponenter/Tabs',
  component: Tabs,
} as Meta;

export const Preview: StoryFn<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <Tabs.List>
      <Tabs.Tab value='value1'>Tab 1</Tabs.Tab>
      <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
      <Tabs.Tab value='value3'>Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Content value='value1'>content 1</Tabs.Content>
    <Tabs.Content value='value2'>content 2</Tabs.Content>
    <Tabs.Content value='value3'>content 3</Tabs.Content>
  </Tabs>
);

Preview.args = {
  defaultValue: 'value1',
  size: 'medium',
};

export const IconsOnly: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue='value1'>
    <Tabs.List>
      <Tabs.Tab value='value1'>
        <AkselIcon title='Airplane' />
      </Tabs.Tab>
      <Tabs.Tab value='value2'>
        <AkselIcon2 title='Newspaper' />
      </Tabs.Tab>
      <Tabs.Tab value='value3'>
        <AkselIcon3 title='Dog' />
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Content value='value1'>content 1</Tabs.Content>
    <Tabs.Content value='value2'>content 2</Tabs.Content>
    <Tabs.Content value='value3'>content 3</Tabs.Content>
  </Tabs>
);

export const Controlled: StoryFn<typeof Tabs> = () => {
  const [value, setValue] = useState('value1');

  return (
    <>
      <Button
        size='small'
        onClick={() => setValue('value3')}
      >
        Choose Tab 3
      </Button>
      <br />
      <Tabs
        value={value}
        onChange={setValue}
      >
        <Tabs.List>
          <Tabs.Tab value='value1'>
            {icon}
            Tab 1
          </Tabs.Tab>
          <Tabs.Tab value='value2'>
            <AkselIcon2 />
            Tab 2
          </Tabs.Tab>
          <Tabs.Tab value='value3'>
            <AkselIcon4 />
            Tab 3
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value='value1'>content 1</Tabs.Content>
        <Tabs.Content value='value2'>content 2</Tabs.Content>
        <Tabs.Content value='value3'>content 3</Tabs.Content>
      </Tabs>
    </>
  );
};
