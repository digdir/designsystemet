import { Tabs, Tooltip } from '@digdir/designsystemet-react';
import { BicycleIcon, CarIcon, MotorcycleIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

export const Preview = () => {
  return (
    <Tabs defaultValue='value1'>
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
};

export const IconsOnly = () => {
  return (
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
};

export const IconsWithText = () => {
  return (
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
};

export const Controlled = () => {
  const [value, setValue] = useState('value1');

  return (
    <Tabs value={value} onChange={(newValue) => setValue(newValue)}>
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
};
