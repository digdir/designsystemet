import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';

import { Paragraph } from '../Typography';

import { Link } from '.';

type Story = StoryObj<typeof Link>;

export default {
  title: 'Komponenter/Link',
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
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: '#333333',
          padding: '32px',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const InText: StoryFn<typeof Link> = () => (
  <>
    <Paragraph>
      Vi bruker komponenter fra{' '}
      <Link href='https://designsystem.no/'>et fantastisk designsystem</Link>.
    </Paragraph>
    <Paragraph>
      <Link href='mailto:designsystem@digdir.no'>
        <EnvelopeClosedIcon aria-hidden />
        Kontakt oss
      </Link>
    </Paragraph>
  </>
);

export const LongLink: StoryFn<typeof Link> = () => (
  <Paragraph>
    <Link href='https://designsystem.no/'>
      Dette er en lenke som brekker over flere linjer
    </Link>
  </Paragraph>
);

LongLink.decorators = [
  (Story) => (
    <div style={{ width: '200px' }}>
      <Story></Story>
    </div>
  ),
];
