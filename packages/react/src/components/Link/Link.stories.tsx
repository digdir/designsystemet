import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Paragraph } from '../Paragraph';

import { Link } from '.';

type Story = StoryObj<typeof Link>;

const randomNum = Math.floor(Math.random() * 1000);
const designsystemetLink = 'https://designsystemet.no/?=' + randomNum;

export default {
  title: 'Komponenter/Link',
  component: Link,
  parameters: {
    customStyles: { padding: '2px' },
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Normal: Story = {
  args: {
    children: 'Gå til designsystemet',
    href: designsystemetLink,
    color: 'accent',
  },
};

export const InText: StoryFn = (args) => (
  <>
    <Paragraph>
      Vi bruker komponenter fra{' '}
      <Link href={designsystemetLink} {...args}>
        et fantastisk designsystem
      </Link>
      .
    </Paragraph>
  </>
);

export const WithIcon: StoryFn = (args) => (
  <Link href='mailto:designsystem@digdir.no' {...args}>
    <EnvelopeClosedIcon aria-hidden />
    Kontakt oss
  </Link>
);

export const LongLink: StoryFn = (args) => (
  <Paragraph>
    <Link href={designsystemetLink} {...args}>
      Dette er en lenke som brekker over flere linjer
    </Link>
  </Paragraph>
);

LongLink.parameters = {
  customStyles: { width: '200px' },
};

export const Neutral: Story = {
  args: {
    children: 'Gå til designsystemet',
    href: designsystemetLink,
    color: 'neutral',
  },
};
