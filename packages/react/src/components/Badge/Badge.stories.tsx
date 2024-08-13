import type { Meta, StoryFn } from '@storybook/react';

import {
  EnvelopeClosedFillIcon,
  HeartFillIcon,
  PencilIcon,
  VideoFillIcon,
} from '@navikt/aksel-icons';
import { Tabs } from '../Tabs';
import { Badge } from './Badge';

type Story = StoryFn<typeof Badge>;

const meta: Meta<typeof Badge> = {
  title: 'Komponenter/Badge',
  component: Badge,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    color: {
      options: ['accent', 'info', 'success', 'warning', 'danger', 'neutral'],
      control: { type: 'select' },
    },
    placement: {
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

export const Preview: Story = (args) => <Badge {...args}></Badge>;

Preview.args = {
  size: 'md',
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
    <Badge color='accent' size='md' placement='top-right'>
      <EnvelopeClosedFillIcon fontSize='2rem' />
    </Badge>
    <Badge color='accent' size='md' placement='top-left'>
      <EnvelopeClosedFillIcon fontSize='2rem' />
    </Badge>
    <Badge color='accent' size='md' placement='bottom-right'>
      <EnvelopeClosedFillIcon fontSize='2rem' />
    </Badge>
    <Badge color='accent' size='md' placement='bottom-left'>
      <EnvelopeClosedFillIcon fontSize='2rem' />
    </Badge>
    <Badge color='accent' size='md' placement='top-right' overlap='circle'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge>
    <Badge color='accent' size='md' placement='top-left' overlap='circle'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge>
    <Badge color='accent' size='md' placement='bottom-right' overlap='circle'>
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: 'var(--ds-color-brand2-base-default)',
        }}
      />
    </Badge>
    <Badge color='accent' size='md' placement='bottom-left' overlap='circle'>
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

export const Status: Story = (args) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--ds-spacing-4)',
    }}
  >
    <Badge color='danger' size='sm'>
      <VideoFillIcon fontSize='2rem' />
    </Badge>
    <Badge color='danger' size='md'>
      <VideoFillIcon fontSize='2rem' />
    </Badge>
    <Badge color='danger' size='lg'>
      <VideoFillIcon fontSize='2rem' />
    </Badge>
  </div>
);

export const InTabs: Story = (args) => (
  <Tabs.Root defaultValue='value1' size='md'>
    <Tabs.List>
      <Tabs.Tab value='value1'>
        <HeartFillIcon fontSize='1.75rem' />
        Favoritter
        <Badge count={64} maxCount={10} color='neutral' />
      </Tabs.Tab>
      <Tabs.Tab value='value2'>Tab 2</Tabs.Tab>
      <Tabs.Tab value='value3'>
        <PencilIcon fontSize='1.75rem' />
        Nylige
        <Badge count={2} color='neutral' />
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Content value='value1'>content 1</Tabs.Content>
    <Tabs.Content value='value2'>content 2</Tabs.Content>
    <Tabs.Content value='value3'>content 3</Tabs.Content>
  </Tabs.Root>
);
