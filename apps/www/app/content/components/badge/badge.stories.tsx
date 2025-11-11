import { Badge, Button, Tabs } from '@digdir/designsystemet-react';
import {
  ChatIcon,
  EnvelopeClosedFillIcon,
  InboxIcon,
  VideoFillIcon,
  VideoIcon,
} from '@navikt/aksel-icons';
import type { CSSProperties } from 'react';

export const Preview = () => {
  return <Badge count={15} maxCount={9} />;
};

export const Floating = () => (
  <>
    <Badge.Position placement='top-right'>
      <Badge data-color='accent'></Badge>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge.Position>

    <Badge.Position placement='bottom-right' overlap='circle'>
      <Badge data-color='accent'></Badge>
      <div
        style={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand1-base-default)',
        }}
      />
    </Badge.Position>
  </>
);

export const CustomPlacement = () => (
  <>
    <Badge.Position
      placement='top-right'
      style={
        {
          '--dsc-badge-top': '16%',
          '--dsc-badge-right': '10%',
        } as CSSProperties
      }
    >
      <Badge data-color='accent'></Badge>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge.Position>
  </>
);

export const Status = () => (
  <>
    <Badge.Position data-size='sm'>
      <Badge data-color='danger' />
      <VideoFillIcon title='Videokamera' />
    </Badge.Position>
    <Badge.Position data-size='md'>
      <Badge data-color='danger' />
      <VideoFillIcon title='Videokamera' />
    </Badge.Position>
    <Badge.Position data-size='lg'>
      <Badge data-color='danger' />
      <VideoFillIcon title='Videokamera' />
    </Badge.Position>
  </>
);

export const InTabs = () => (
  <Tabs defaultValue='value1'>
    <Tabs.List>
      <Tabs.Tab value='value1'>
        Favoritter
        <Badge count={64} maxCount={10} data-color='neutral' />
      </Tabs.Tab>
      <Tabs.Tab value='value2'>Arkiv</Tabs.Tab>
      <Tabs.Tab value='value3'>
        Nylige
        <Badge count={2} data-color='neutral' />
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value='value1'>content 1</Tabs.Panel>
    <Tabs.Panel value='value2'>content 2</Tabs.Panel>
    <Tabs.Panel value='value3'>content 3</Tabs.Panel>
  </Tabs>
);

export const InButton = () => (
  <>
    <Button icon variant='tertiary'>
      <Badge.Position>
        <Badge data-color='danger' count={1000} maxCount={99} />
        <InboxIcon title='Innboks' />
      </Badge.Position>
    </Button>
    <Button icon variant='tertiary'>
      <Badge.Position>
        <Badge data-color='danger' count={10} />
        <ChatIcon title='Meldinger' />
      </Badge.Position>
    </Button>
    <Button icon variant='tertiary'>
      <Badge.Position>
        <Badge data-color='danger'></Badge>
        <VideoIcon title='Skru på video' />
      </Badge.Position>
    </Button>
  </>
);

export const Variants = () => {
  const VariantsMap: {
    [key: string]: { [key: string]: string };
  } = {
    neutralBase: {
      'data-color': 'neutral',
    },
    neutralTinted: {
      'data-color': 'neutral',
      variant: 'tinted',
    },
    dangerBase: {
      'data-color': 'danger',
    },
    dangerTinted: {
      'data-color': 'danger',
      variant: 'tinted',
    },
    infoBase: {
      'data-color': 'info',
    },
    infoTinted: {
      'data-color': 'info',
      variant: 'tinted',
    },
    warningBase: {
      'data-color': 'warning',
    },
    warningTinted: {
      'data-color': 'warning',
      variant: 'tinted',
    },
  };
  return (
    <>
      {Object.entries(VariantsMap).map(([key, value]) => (
        <Badge key={key} {...value} count={15} maxCount={9} />
      ))}
    </>
  );
};
