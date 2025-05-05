import {
  BackpackIcon,
  BellIcon,
  BicycleIcon,
  CarIcon,
  MotorcycleIcon,
  NewspaperIcon,
} from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';

import { Tabs } from '.';
import { Tooltip } from '../Tooltip';

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
    <Tabs.Panel value='value1'>content 1</Tabs.Panel>
    <Tabs.Panel value='value2'>content 2</Tabs.Panel>
    <Tabs.Panel value='value3'>content 3</Tabs.Panel>
  </Tabs>
);

Preview.args = {
  defaultValue: 'value1',
};

export const IconsOnly: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue='car'>
    <Tabs.List>
      <Tooltip content='Dine biler'>
        <Tabs.Tab value='car'>
          <CarIcon title='car' />
        </Tabs.Tab>
      </Tooltip>
      <Tooltip content='Dine sykler'>
        <Tabs.Tab value='bicycle'>
          <BicycleIcon title='Bicycle' />
        </Tabs.Tab>
      </Tooltip>
      <Tooltip content='Dine motorsykler'>
        <Tabs.Tab value='motorcycle'>
          <MotorcycleIcon title='Motorcycle' />
        </Tabs.Tab>
      </Tooltip>
    </Tabs.List>
    <Tabs.Panel value='car'>
      Du har ingen av denne typen registrert hos oss
    </Tabs.Panel>
    <Tabs.Panel value='bicycle'>
      Du har ingen av denne typen registrert hos oss
    </Tabs.Panel>
    <Tabs.Panel value='motorcycle'>
      Du har ingen av denne typen registrert hos oss
    </Tabs.Panel>
  </Tabs>
);

export const IconsWithText: StoryFn<typeof Tabs> = () => (
  <Tabs defaultValue='car'>
    <Tabs.List>
      <Tabs.Tab value='car'>
        <CarIcon aria-hidden='true' />
        Biler
      </Tabs.Tab>

      <Tabs.Tab value='bicycle'>
        <BicycleIcon aria-hidden='true' />
        Sykler
      </Tabs.Tab>

      <Tabs.Tab value='motorcycle'>
        <MotorcycleIcon aria-hidden='true' />
        Motorsykler
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value='car'>
      Du har ingen av denne typen registrert hos oss
    </Tabs.Panel>
    <Tabs.Panel value='bicycle'>
      Du har ingen av denne typen registrert hos oss
    </Tabs.Panel>
    <Tabs.Panel value='motorcycle'>
      Du har ingen av denne typen registrert hos oss
    </Tabs.Panel>
  </Tabs>
);

export const Controlled: StoryFn<typeof Tabs> = () => {
  const [value, setValue] = useState('value1');

  return (
    <>
      <Button data-size='sm' onClick={() => setValue('value3')}>
        Choose Tab 3
      </Button>
      <br />
      <Tabs value={value} onChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value='value1'>
            <BellIcon aria-hidden />
            Tab 1
          </Tabs.Tab>
          <Tabs.Tab value='value2'>
            <NewspaperIcon aria-hidden />
            Tab 2
          </Tabs.Tab>
          <Tabs.Tab value='value3'>
            <BackpackIcon aria-hidden />
            Tab 3
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='value1'>content 1</Tabs.Panel>
        <Tabs.Panel value='value2'>content 2</Tabs.Panel>
        <Tabs.Panel value='value3'>content 3</Tabs.Panel>
      </Tabs>
    </>
  );
};
