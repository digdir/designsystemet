import cat1 from '@assets/img/cats/Cat 1.jpg';
import cat2 from '@assets/img/cats/Cat 2.jpg';
import cat3 from '@assets/img/cats/Cat 3.jpg';
import cat4 from '@assets/img/cats/Cat 4.jpg';
import cat5 from '@assets/img/cats/Cat 5.jpg';
import { PlusIcon, TrashFillIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';

import { Card } from '.';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Paragraph } from '../Paragraph';
import { Select } from '../form/Select';
import { Textfield } from '../form/Textfield';

type Story = StoryFn<typeof Card>;

export default {
  title: 'Komponenter/Card',
  component: Card,
  decorators: [
    (Story) => (
      <div
        style={{
          width: '90vw',
          maxWidth: 800,
          alignItems: 'center',
          display: 'grid',
          gap: 'var(--ds-spacing-4)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px , 1fr))',
          justifyItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
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

export const Variants: StoryFn<typeof Card> = () => (
  <>
    <Card color='neutral'>
      <Card.Block>
        <img src={cat1} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
    <Card color='subtle'>
      <Card.Block>
        <img src={cat2} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card Subtle
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
    <Card color='brand1'>
      <Card.Block>
        <img src={cat3} alt='katter' />
      </Card.Block>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card First
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
    <Card color='brand2'>
      <Card.Block>
        <img src={cat4} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card Second
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
    <Card color='brand3'>
      <Card.Block>
        <img src={cat5} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card Third
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
  </>
);

export const Media: Story = () => (
  <>
    <Card>
      <Card.Block>
        <img src={cat1} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
    <Card>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
      <Card.Block>
        <img src={cat1} alt='katt' />
      </Card.Block>
    </Card>
  </>
);

export const Video: Story = () => (
  <Card color='neutral' style={{ width: '320px' }}>
    <Card.Block>
      <iframe
        src='https://player.vimeo.com/video/863563441?app_id=122963&amp;title=0&amp;byline=0&amp;portrait=0&amp;dnt=1'
        width='320px'
        height='179px'
        allow='autoplay; fullscreen; picture-in-picture'
        title='30 år med digitalt innsyn'
      ></iframe>
    </Card.Block>
    <Card.Block>
      <Heading level={2} size='sm'>
        <a
          href='https://www.digdir.no/felleslosninger/30-ar-med-digitalt-innsyn/5015'
          target='_blank'
          rel='noreferrer'
        >
          Vi feira 30 år med digitalt innsyn
        </a>
      </Heading>
      <Paragraph>
        Det er i år 30 år sidan dei første forsøka med elektronisk postjournal i
        Noreg. Sjå opptak frå feiringa på Pressens Hus der det både var
        historiske tilbakeblikk og debatt om innsyn og openheit i forvaltninga.
      </Paragraph>
    </Card.Block>
  </Card>
);

const options = [
  { value: 'daglig leder', label: 'Dalig leder' },
  { value: 'forretningsfører', label: 'Forretningsfører' },
];

export const Composed: Story = () => (
  <div
    style={{
      display: 'grid', // Used to test Card.Block border logic
      gap: 'var(--ds-spacing-4)',
      gridColumn: '1 / -1',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px , 1fr))',
      width: '100%',
    }}
  >
    <Card>
      <Card.Block>
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
      </Card.Block>
      <Card.Block>
        <Select label='Velg rolle'>
          {options.map(({ value, label }, index) => (
            <Select.Option key={index} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
        <Textfield label='Fødsels- eller d-nummer' />
        <Textfield label='Etternavn' />
      </Card.Block>
      <Card.Block>
        <Button variant='secondary' size='sm'>
          Legg til rolle
          <PlusIcon aria-hidden fontSize='1.5rem' />
        </Button>
      </Card.Block>
    </Card>
    <Card>
      <Card.Block>
        <img src={cat1} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading level={2} size='sm'>
          Card Neutral
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this.
        </Paragraph>
      </Card.Block>
    </Card>
  </div>
);

export const WithLink: Story = (args) => (
  <>
    <Card {...args} color='brand1'>
      <Card.Block>
        <img src={cat5} alt='' />
      </Card.Block>
      <Card.Block>
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
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
        <Paragraph size='sm'>Footer text</Paragraph>
      </Card.Block>
    </Card>
    <Card {...args} color='neutral'>
      <Card.Block>
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
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
        <Paragraph size='sm'>Footer text</Paragraph>
      </Card.Block>
      <Card.Block>
        <img src={cat5} alt='' />
      </Card.Block>
    </Card>
  </>
);

export const AsLink: Story = (args) => (
  <>
    <Card {...args} color='brand1' asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Card.Block>
          <Heading size='sm' level={2}>
            Link Card with blocks
          </Heading>
        </Card.Block>
        <Card.Block>
          <Paragraph>
            Most provide as with carried business are much better more the
            perfected designer.
          </Paragraph>
        </Card.Block>
      </a>
    </Card>
    <Card {...args} color='neutral' asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Heading size='sm' level={2}>
          Link Card
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer.
        </Paragraph>
      </a>
    </Card>
  </>
);

export const AsButton: Story = (args) => (
  <>
    <Card {...args} color='brand1' asChild>
      <button type='button'>
        <Card.Block>
          <Heading size='sm' level={2}>
            Button Card with blocks
          </Heading>
        </Card.Block>
        <Card.Block>
          <Paragraph>
            Most provide as with carried business are much better more the
            perfected designer.
          </Paragraph>
        </Card.Block>
      </button>
    </Card>
    <Card {...args} color='neutral' asChild>
      <button type='button'>
        <Heading size='sm' level={2}>
          Link Card
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer.
        </Paragraph>
      </button>
    </Card>
  </>
);

export const AsGrid: Story = (args) => (
  <Card {...args} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
    <Card.Block>
      <Heading size='sm' level={2}>
        Button Card with blocks
      </Heading>
    </Card.Block>
    <Card.Block>
      <Paragraph>
        Most provide as with carried business are much better more the perfected
        designer.
      </Paragraph>
    </Card.Block>
  </Card>
);
