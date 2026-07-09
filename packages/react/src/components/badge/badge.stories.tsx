import {
  ChatIcon,
  EnvelopeClosedFillIcon,
  HeartFillIcon,
  InboxIcon,
  PencilIcon,
  VideoFillIcon,
  VideoIcon,
} from '@navikt/aksel-icons';
import type { CSSProperties } from 'react';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Badge, Button, Paragraph, Tabs } from '../';

const meta = preview.meta({
  title: 'Komponenter/Badge',
  component: Badge,
  parameters: {
    customStyles: {
      flexWrap: 'wrap',
    },
  },
});

export const Preview = meta.story({
  args: {
    count: 15,
    maxCount: 9,
  },
});

export const Floating = meta.story({
  render: () => (
    <>
      <Badge.Position placement='top-right'>
        <Badge data-color='accent'></Badge>
        <EnvelopeClosedFillIcon title='Meldinger' />
      </Badge.Position>
      <Badge.Position placement='top-left'>
        <Badge data-color='accent'></Badge>
        <EnvelopeClosedFillIcon title='Meldinger' />
      </Badge.Position>
      <Badge.Position placement='bottom-right'>
        <Badge data-color='accent'></Badge>
        <EnvelopeClosedFillIcon title='Meldinger' />
      </Badge.Position>
      <Badge.Position placement='bottom-left'>
        <Badge data-color='accent'></Badge>
        <EnvelopeClosedFillIcon title='Meldinger' />
      </Badge.Position>
      <Badge.Position placement='top-right' overlap='circle'>
        <Badge data-color='accent'></Badge>
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: 'var(--ds-color-brand2-base-default)',
          }}
        />
      </Badge.Position>
      <Badge.Position placement='top-left' overlap='circle'>
        <Badge data-color='accent'></Badge>
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: 'var(--ds-color-brand2-base-default)',
          }}
        />
      </Badge.Position>
      <Badge.Position placement='bottom-right' overlap='circle'>
        <Badge data-color='accent'></Badge>
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: 'var(--ds-color-brand2-base-default)',
          }}
        />
      </Badge.Position>
      <Badge.Position placement='bottom-left' overlap='circle'>
        <Badge data-color='accent'></Badge>
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: 'var(--ds-color-brand2-base-default)',
          }}
        />
      </Badge.Position>
    </>
  ),

  parameters: {
    customStyles: {
      display: 'flex',
      gap: 'var(--ds-size-4)',
      flexWrap: 'wrap',
    },
  },
});

export const CustomPlacement = meta.story(() => (
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
));

export const Status = meta.story(() => (
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
));

export const InTabs = meta.story(() => (
  <Tabs defaultValue='value1'>
    <Tabs.List>
      <Tabs.Tab value='value1'>
        <HeartFillIcon aria-hidden />
        Favoritter
        <Badge count={64} maxCount={10} data-color='neutral' />
      </Tabs.Tab>
      <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
      <Tabs.Tab value='value3'>
        <PencilIcon aria-hidden />
        Nylige
        <Badge count={2} data-color='neutral' />
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value='value1'>content 1</Tabs.Panel>
    <Tabs.Panel value='value2'>content 2</Tabs.Panel>
    <Tabs.Panel value='value3'>content 3</Tabs.Panel>
  </Tabs>
));

export const InButton = meta.story(() => (
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
    <Badge.Position>
      <Badge data-color='danger' count={10} />
      <Button>
        <InboxIcon title='Innboks' /> Test
      </Button>
    </Badge.Position>
  </>
));

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

export const Variants = meta.story({
  render: () => (
    <>
      {Object.entries(VariantsMap).map(([key, value]) => (
        <Badge key={key} {...value} count={15} maxCount={9} />
      ))}
    </>
  ),

  parameters: {
    customStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--ds-size-2)',
      height: '100%',
      width: '100%',
    },
  },
});

export const Bullet = meta.story(() => (
  <Paragraph>
    <Badge data-color='success' />
    Aktiv
  </Paragraph>
));
