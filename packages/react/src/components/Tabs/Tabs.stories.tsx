import {
  AirplaneIcon,
  BackpackIcon,
  BellIcon,
  DogIcon,
  NewspaperIcon,
} from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';

import { Tabs } from '.';

export default {
  title: 'Komponenter/Tabs',
  component: Tabs,
} as Meta;

export const Preview: StoryFn<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <Tabs.List>
      <Tabs.Tab>Tab 1</Tabs.Tab>
      <Tabs.Tab>Tab 2</Tabs.Tab>
      <Tabs.Tab>Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel>content 1</Tabs.Panel>
    <Tabs.Panel>content 2</Tabs.Panel>
    <Tabs.Panel>content 3</Tabs.Panel>
  </Tabs>
);

Preview.args = {
  defaultValue: 'value1',
  'data-size': 'md',
};

export const IconsOnly: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue='value1'>
    <Tabs.List>
      <Tabs.Tab>
        <AirplaneIcon title='Airplane' />
      </Tabs.Tab>
      <Tabs.Tab>
        <NewspaperIcon title='Newspaper' />
      </Tabs.Tab>
      <Tabs.Tab>
        <DogIcon title='Dog' />
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel>content 1</Tabs.Panel>
    <Tabs.Panel>content 2</Tabs.Panel>
    <Tabs.Panel>content 3</Tabs.Panel>
  </Tabs>
);

export const Controlled: StoryFn<typeof Tabs> = () => {
  const [value, setValue] = useState(1);

  return (
    <>
      <Button data-size='sm' onClick={() => setValue(2)}>
        Choose Tab 3
      </Button>
      <br />
      <Tabs onChange={setValue} selectedIndex={value}>
        <Tabs.List>
          <Tabs.Tab>
            <BellIcon aria-hidden />
            Tab 1
          </Tabs.Tab>
          <Tabs.Tab>
            <NewspaperIcon aria-hidden />
            Tab 2
          </Tabs.Tab>
          <Tabs.Tab>
            <BackpackIcon aria-hidden />
            Tab 3
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel>content 1</Tabs.Panel>
        <Tabs.Panel>content 2</Tabs.Panel>
        <Tabs.Panel>content 3</Tabs.Panel>
      </Tabs>
    </>
  );
};
