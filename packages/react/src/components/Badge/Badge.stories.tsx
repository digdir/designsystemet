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
import { Badge } from './Badge';

type Story = StoryFn<typeof Badge>;

const meta: Meta<typeof Badge> = {
  title: 'Komponenter/Badge',
  component: Badge,
};

export default meta;

export const Preview: Story = (args) => <Badge {...args}></Badge>;

Preview.args = {
  'data-size': 'md',
  count: 10,
  maxCount: 9,
  color: 'accent',
};

export const Floating: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-6)',
    }}
  >
    <Badge color='accent' placement='top-right'>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge>
    <Badge color='accent' placement='top-left'>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge>
    <Badge color='accent' placement='bottom-right'>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge>
    <Badge color='accent' placement='bottom-left'>
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge>
    <Badge color='accent' placement='top-right' overlap='circle'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge>
    <Badge color='accent' placement='top-left' overlap='circle'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge>
    <Badge color='accent' placement='bottom-right' overlap='circle'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge>
    <Badge color='accent' placement='bottom-left' overlap='circle'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge>
  </div>
);

export const CustomPlacement: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-6)',
    }}
  >
    <Badge
      color='accent'
      placement='top-right'
      style={{
        top: '16%',
        right: '10%',
      }}
    >
      <EnvelopeClosedFillIcon title='Meldinger' />
    </Badge>
  </div>
);

export const Status: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-4)',
    }}
  >
    <Badge color='danger' data-size='sm'>
      <VideoFillIcon title='Videokamera' />
    </Badge>
    <Badge color='danger' data-size='md'>
      <VideoFillIcon title='Videokamera' />
    </Badge>
    <Badge color='danger' data-size='lg'>
      <VideoFillIcon title='Videokamera' />
    </Badge>
  </div>
);

export const InTabs: Story = (args) => (
  <Tabs defaultValue='value1'>
    <Tabs.List>
      <Tabs.Tab value='value1'>
        <HeartFillIcon aria-hidden />
        Favoritter
        <Badge count={64} maxCount={10} color='neutral' />
      </Tabs.Tab>
      <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
      <Tabs.Tab value='value3'>
        <PencilIcon aria-hidden />
        Nylige
        <Badge count={2} color='neutral' />
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
      <Badge color='danger' count={1000} maxCount={99} data-size='sm'>
        <InboxIcon title='Innboks' />
      </Badge>
    </Button>
    <Button icon variant='tertiary'>
      <Badge color='danger' count={10} data-size='sm'>
        <ChatIcon title='Meldinger' />
      </Badge>
    </Button>
    <Button icon variant='tertiary'>
      <Badge color='danger' data-size='sm'>
        <VideoIcon title='Skru på video' />
      </Badge>
    </Button>
  </div>
);
