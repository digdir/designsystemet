import cat1 from '@assets/img/cats/Cat 1.jpg';
import cat2 from '@assets/img/cats/Cat 2.jpg';
import cat3 from '@assets/img/cats/Cat 3.jpg';
import cat4 from '@assets/img/cats/Cat 4.jpg';
import cat5 from '@assets/img/cats/Cat 5.jpg';
import cat6 from '@assets/img/cats/Cat 6.jpg';
import { TrashFillIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Divider } from '../Divider';
import { Link } from '../Link';
import { Heading, Paragraph } from '../Typography';
import { Select } from '../form/Select';
import { Textfield } from '../form/Textfield';

import { Card } from '.';

type Story = StoryFn<typeof Card>;

export default {
  title: 'Komponenter/Card',
  component: Card,
} as Meta;

export const Preview: Story = (args) => (
  <Card {...args} style={{ width: 320 }}>
    <Heading size='sm' level={2}>
      Card Neutral
    </Heading>
    <Paragraph>
      Most provide as with carried business are much better more the perfected
      designer. Writing slightly explain desk unable at supposedly about this
    </Paragraph>
    <Paragraph size='sm'>Footer text</Paragraph>
  </Card>
);

Preview.args = {
  color: 'neutral',
};

export const LinkCard: Story = (args) => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--ds-spacing-4)',
      gridTemplateColumns: 'repeat(2, 400px)',
    }}
  >
    <Card {...args} color='brand1'>
      <Card.Part>
        <img src={cat5} alt='' />
      </Card.Part>
      <Heading size='sm' level={2}>
        <a
          href='https://designsystemet.no'
          target='_blank'
          rel='noopener noreferrer'
        >
          Link Card
        </a>
      </Heading>
      <Paragraph>
        Most provide as with carried business are much better more the perfected
        designer. Writing slightly explain desk unable at supposedly about this
      </Paragraph>
      <Paragraph size='sm'>Footer text</Paragraph>
    </Card>
    <Card {...args} color='neutral'>
      <Card.Part>
        <img src={cat6} alt='' />
      </Card.Part>
      <Heading size='sm' level={2}>
        <a
          href='https://designsystemet.no'
          target='_blank'
          rel='noopener noreferrer'
        >
          Link Card
        </a>
      </Heading>
      <Paragraph>
        Most provide as with carried business are much better more the perfected
        designer. Writing slightly explain desk unable at supposedly about this
      </Paragraph>
      <Paragraph size='sm'>Footer text</Paragraph>
    </Card>
  </div>
);

export const Variants: StoryFn<typeof Card> = () => {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--ds-spacing-4)',
        gridTemplateColumns: 'repeat(2, 400px)',
      }}
    >
      <Card color='neutral'>
        <Card.Part>
          <img src={cat1} alt='katt' />
        </Card.Part>
        <Heading level={2} size='sm'>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card color='subtle'>
        <Card.Part>
          <img src={cat2} alt='katt' />
        </Card.Part>
        <Heading level={2} size='sm'>
          Card Subtle
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card color='brand1'>
        <Card.Part>
          <img src={cat3} alt='katter' />
        </Card.Part>
        <Heading level={2} size='sm'>
          Card First
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card color='brand2'>
        <Card.Part>
          <img src={cat4} alt='katt' />
        </Card.Part>
        <Heading level={2} size='sm'>
          Card Second
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
      <Card color='brand3'>
        <Card.Part>
          <img src={cat5} alt='katt' />
        </Card.Part>
        <Heading level={2} size='sm'>
          Card Third
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card>
    </div>
  );
};

export const Media: Story = () => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--ds-spacing-4)',
      gridTemplateColumns: 'repeat(2, 300px)',
    }}
  >
    <Card>
      <Card.Part>
        <img src={cat1} alt='katt' />
      </Card.Part>
      <Heading level={2} size='sm'>
        Card Neutral
      </Heading>
      <Paragraph>
        Most provide as with carried business are much better more the perfected
        designer. Writing slightly explain desk unable at supposedly about this
      </Paragraph>
    </Card>
    <Card>
      <Heading level={2} size='sm'>
        Card Neutral
      </Heading>
      <Paragraph>
        Most provide as with carried business are much better more the perfected
        designer. Writing slightly explain desk unable at supposedly about this
      </Paragraph>
      <Card.Part>
        <img src={cat1} alt='katt' />
      </Card.Part>
    </Card>
  </div>
);

export const Video: Story = () => (
  <Card color='neutral' style={{ width: '320px' }}>
    <Card.Part>
      <iframe
        src='https://player.vimeo.com/video/863563441?app_id=122963&amp;title=0&amp;byline=0&amp;portrait=0&amp;dnt=1'
        width='320px'
        height='179px'
        allow='autoplay; fullscreen; picture-in-picture'
        title='30 år med digitalt innsyn'
      ></iframe>
    </Card.Part>
    <Heading level={2} size='sm'>
      <Link
        href='https://www.digdir.no/felleslosninger/30-ar-med-digitalt-innsyn/5015'
        target='_blank'
      >
        Vi feira 30 år med digitalt innsyn
      </Link>
    </Heading>
    <Paragraph>
      Det er i år 30 år sidan dei første forsøka med elektronisk postjournal i
      Noreg. Sjå opptak frå feiringa på Pressens Hus der det både var historiske
      tilbakeblikk og debatt om innsyn og openheit i forvaltninga.
    </Paragraph>
  </Card>
);

const options = [
  { value: 'daglig leder', label: 'Dalig leder' },
  { value: 'forretningsfører', label: 'Forretningsfører' },
];

export const Composed: Story = () => (
  <Card style={{ width: '320px' }}>
    <Card.Part>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Heading level={2} size='xs'>
          Rolle 1
        </Heading>
        <Button variant='secondary' color='danger' size='sm'>
          <TrashFillIcon aria-hidden fontSize='1.5rem' />
          Fjern
        </Button>
      </div>
    </Card.Part>
    <Divider />
    <Card.Part>
      <Select label='Velg rolle'>
        {options.map(({ value, label }, index) => (
          <Select.Option key={index} value={value}>
            {label}
          </Select.Option>
        ))}
      </Select>
      <Textfield label='Fødsels- eller d-nummer' />
      <Textfield label='Etternavn' />
    </Card.Part>
  </Card>
);

export const AsLink: Story = (args) => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--ds-spacing-4)',
      gridTemplateColumns: 'repeat(2, 400px)',
    }}
  >
    <Card {...args} color='brand1' asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Card.Part>
          <img src={cat5} alt='' />
        </Card.Part>
        <Heading size='sm' level={2}>
          Link Card
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
        <Paragraph size='sm'>Footer text</Paragraph>
      </a>
    </Card>
    <Card {...args} color='neutral' asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Card.Part>
          <img src={cat6} alt='' />
        </Card.Part>
        <Heading size='sm' level={2}>
          Link Card
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
        <Paragraph size='sm'>Footer text</Paragraph>
      </a>
    </Card>
  </div>
);
