import type { Meta, StoryFn } from '@storybook/react';

import {
  ChatIcon,
  EnvelopeClosedFillIcon,
  HeartFillIcon,
  InboxIcon,
  PencilIcon,
  VideoFillIcon,
  VideoIcon,
} from '@navikt/aksel-icons';
import { Button } from '../Button';
import { Tabs } from '../Tabs';
import { Badge } from './';

type Story = StoryFn<typeof Badge>;

const meta: Meta<typeof Badge> = {
  title: 'Komponenter/Badge',
  component: Badge,
};

export default meta;

export const Preview: Story = (args) => {
  return (
    <Badge.Placement>
      <Badge {...args}></Badge>
      <p
        style={{
          margin: 0,
        }}
      >
        badge
      </p>
    </Badge.Placement>
  );
};

Preview.args = {
  'data-size': 'md',
  'data-color': 'accent',
};

export const Floating: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-6)',
    }}
  >
    <Badge.Placement placement='top-right'>
      <Badge data-color='accent'></Badge>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge.Placement>
    <Badge.Placement placement='top-left'>
      <Badge data-color='accent'></Badge>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge.Placement>
    <Badge.Placement placement='bottom-right'>
      <Badge data-color='accent'></Badge>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge.Placement>
    <Badge.Placement placement='bottom-left'>
      <Badge data-color='accent'></Badge>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge.Placement>
    <Badge.Placement placement='top-right' overlap='circle'>
      <Badge data-color='accent'></Badge>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge.Placement>
    <Badge.Placement placement='top-left' overlap='circle'>
      <Badge data-color='accent'></Badge>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge.Placement>
    <Badge.Placement placement='bottom-right' overlap='circle'>
      <Badge data-color='accent'></Badge>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge.Placement>
    <Badge.Placement placement='bottom-left' overlap='circle'>
      <Badge data-color='accent'></Badge>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge.Placement>
  </div>
);

export const CustomPlacement: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-6)',
    }}
  >
    <Badge.Placement
      placement='top-right'
      style={{
        top: '16%',
        right: '10%',
      }}
    >
      <Badge data-color='accent'></Badge>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge.Placement>
  </div>
);

export const Status: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-4)',
    }}
  >
    <Badge.Placement data-size='sm'>
      <Badge data-color='danger' />
      <VideoFillIcon title='Videokamera' />
    </Badge.Placement>
    <Badge.Placement data-size='md'>
      <Badge data-color='danger' />
      <VideoFillIcon title='Videokamera' />
    </Badge.Placement>
    <Badge.Placement data-size='lg'>
      <Badge data-color='danger' />
      <VideoFillIcon title='Videokamera' />
    </Badge.Placement>
  </div>
);

export const InTabs: Story = (args) => (
  <Tabs defaultValue='value1'>
    <Tabs.List>
      <Tabs.Tab value='value1'>
        <HeartFillIcon aria-hidden />
        Favoritter
        <Badge /* count={64} maxCount={10} */ data-color='neutral'>10+</Badge>
      </Tabs.Tab>
      <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
      <Tabs.Tab value='value3'>
        <PencilIcon aria-hidden />
        Nylige
        <Badge /* count={2} */ data-color='neutral'>2</Badge>
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value='value1'>content 1</Tabs.Panel>
    <Tabs.Panel value='value2'>content 2</Tabs.Panel>
    <Tabs.Panel value='value3'>content 3</Tabs.Panel>
  </Tabs>
);

export const InButton: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-4)',
    }}
  >
    <Button icon variant='tertiary'>
      <Badge.Placement>
        <Badge
          data-color='danger'
          /* count={1000}
          maxCount={99} */
        >
          99+
        </Badge>
        <InboxIcon title='Innboks' />
      </Badge.Placement>
    </Button>
    <Button icon variant='tertiary'>
      <Badge.Placement>
        <Badge data-color='danger' /* count={10} */>10</Badge>
        <ChatIcon title='Meldinger' />
      </Badge.Placement>
    </Button>
    <Button icon variant='tertiary'>
      <Badge.Placement>
        <Badge data-color='danger'></Badge>
        <VideoIcon title='Skru på video' />
      </Badge.Placement>
    </Button>
  </div>
);
