import {
  BookIcon,
  ComponentIcon,
  EnvelopeClosedIcon,
  ExternalLinkIcon,
} from '@navikt/aksel-icons';
import preview from '../../../../../apps/storybook/.storybook/preview';
import { Paragraph } from '../';
import { Link } from './link';

const randomNum = Math.floor(Math.random() * 1000);
const designsystemetLink = 'https://designsystemet.no/?=' + randomNum;

const meta = preview.meta({
  title: 'Komponenter/Link',
  component: Link,
  parameters: {
    customStyles: { padding: 'var(--ds-size-6)' },
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
});

export const Normal = meta.story({
  args: {
    children: 'Gå til designsystemet',
    href: designsystemetLink,
  },
});

export const InText = meta.story({
  render: (args) => (
    <>
      <Paragraph>
        Vi bruker komponenter fra{' '}
        <Link href={designsystemetLink} {...args}>
          designsystemet.no
        </Link>
        .
      </Paragraph>
    </>
  ),
});

export const WithIcon = meta.story({
  render: (args) => (
    <Link href='mailto:designsystem@digdir.no' {...args}>
      <EnvelopeClosedIcon aria-hidden height={'1.5rem'} width={'1.5rem'} />
      <span>Kontakt oss</span>
    </Link>
  ),
});

export const WithIconRight = meta.story({
  render: (args) => (
    <Link href='mailto:designsystem@digdir.no' {...args}>
      <span>Kontakt oss</span>
      <EnvelopeClosedIcon aria-hidden height={'1.5rem'} width={'1.5rem'} />
    </Link>
  ),
});

export const WithMultipleIcons = meta.story({
  render: (args) => (
    <Link href={designsystemetLink} {...args}>
      <ComponentIcon aria-hidden height={'1.5rem'} width={'1.5rem'} />
      <span>Komponenter og</span>
      <BookIcon aria-hidden height={'1.5rem'} width={'1.5rem'} />
      <span>dokumentasjon på designsystemet.no</span>
      <ExternalLinkIcon aria-hidden height={'1.5rem'} width={'1.5rem'} />
    </Link>
  ),
});

export const WithOnlyIcon = meta.story({
  render: (args) => (
    <Link href={designsystemetLink} {...args}>
      <ComponentIcon
        title='Designsystemet'
        height={'1.5rem'}
        width={'1.5rem'}
      />
    </Link>
  ),
});

export const LongLink = meta.story({
  render: (args) => (
    <Paragraph>
      <Link href={designsystemetLink} {...args}>
        Dette er en lenke som brekker over flere linjer
      </Link>
    </Paragraph>
  ),

  parameters: {
    customStyles: { width: '200px' },
  },
});

export const Neutral = meta.story({
  args: {
    children: 'Gå til designsystemet',
    href: designsystemetLink,
    'data-color': 'neutral',
  },
});

export const AsButton = meta.story({
  args: {
    children: <button type='button'>Gå til designsystemet</button>,
    href: designsystemetLink,
    asChild: true,
  },
});
