import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Paragraph } from '../Typography';

import { Link } from '.';

type Story = StoryObj<typeof Link>;

export default {
  title: 'Kjernekomponenter/Link',
  component: Link,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Normal: Story = {
  args: {
    children: 'Gå til designsystemet',
    href: 'https://designsystemet.no/',
  },
};

export const Invertert: Story = {
  args: {
    children: 'Gå til designsystemet',
    inverted: true,
    href: 'https://designsystemet.no/',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const ITekst: StoryFn<typeof Link> = () => (
  <Paragraph>
    Vi bruker komponenter fra{' '}
    <Link href='https://designsystemet.no/'>et fantastisk designsystem</Link>.
  </Paragraph>
);
