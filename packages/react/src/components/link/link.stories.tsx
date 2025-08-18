import {
  BookIcon,
  ComponentIcon,
  EnvelopeClosedIcon,
  ExternalLinkIcon,
} from '@navikt/aksel-icons';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { Paragraph } from '../';
import { Link } from './link';

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
  },
};

export const InText: StoryFn = (args) => (
  <>
    <Paragraph>
      Vi bruker komponenter fra{' '}
      <Link href={designsystemetLink} {...args}>
        designsystemet.no
      </Link>
      .
    </Paragraph>
  </>
);

export const WithIcon: StoryFn = (args) => (
  <Link href='mailto:designsystem@digdir.no' {...args}>
    <EnvelopeClosedIcon aria-hidden fontSize={24} />
    <span>Kontakt oss</span>
  </Link>
);
export const WithIconRight: StoryFn = (args) => (
  <Link href='mailto:designsystem@digdir.no' {...args}>
    <span>Kontakt oss</span>
    <EnvelopeClosedIcon aria-hidden fontSize={24} />
  </Link>
);
export const WithMultipleIcons: StoryFn = (args) => (
  <Link href={designsystemetLink} {...args}>
    <ComponentIcon aria-hidden fontSize={24} />
    <span>Komponenter og</span>
    <BookIcon aria-hidden fontSize={24} />
    <span>dokumentasjon på designsystemet.no</span>
    <ExternalLinkIcon aria-hidden fontSize={24} />
  </Link>
);
export const WithOnlyIcon: StoryFn = (args) => (
  <Link href={designsystemetLink} {...args}>
    <ComponentIcon title='Designsystemet' fontSize={52} />
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
    'data-color': 'neutral',
  },
};
