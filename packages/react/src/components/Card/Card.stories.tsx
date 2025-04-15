import cat1 from '@assets/img/cats/Cat 1.jpg';
import cat5 from '@assets/img/cats/Cat 5.jpg';
import { PlusIcon, TrashFillIcon } from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';

import { Fragment } from 'react/jsx-runtime';
import {
  Button,
  Card,
  Field,
  Heading,
  Label,
  Paragraph,
  Select,
  Textfield,
} from '../../';

type Story = StoryFn<typeof Card>;

export default {
  title: 'Komponenter/Card',
  component: Card,
  parameters: {
    layout: 'fullscreen',
    customStyles: {
      width: '100%',
      maxWidth: 800,
      alignItems: 'center',
      display: 'grid',
      gap: 'var(--ds-size-4)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px , 1fr))',
    },
  },
} satisfies Meta;

export const Preview: Story = (args) => (
  <Card {...args} style={{ maxWidth: '320px' }}>
    <Heading>Card</Heading>
    <Paragraph>
      Most provide as with carried business are much better more the perfected
      designer. Writing slightly explain desk unable at supposedly about this
    </Paragraph>
    <Paragraph data-size='sm'>Footer text</Paragraph>
  </Card>
);

Preview.args = {
  'data-color': 'neutral',
};

const VariantsMap: {
  [key: string]: { [key: string]: string };
} = {
  neutralDefault: {
    'data-color': 'neutral',
    variant: 'default',
  },
  neutralTinted: {
    'data-color': 'neutral',
    variant: 'tinted',
  },
  brand1Default: {
    'data-color': 'brand1',
    variant: 'default',
  },
  brand1Tinted: {
    'data-color': 'brand1',
    variant: 'tinted',
  },
  brand2Default: {
    'data-color': 'brand2',
    variant: 'default',
  },
  brand2Tinted: {
    'data-color': 'brand2',
    variant: 'tinted',
  },
  brand3Default: {
    'data-color': 'brand3',
    variant: 'default',
  },
  brand3Tinted: {
    'data-color': 'brand3',
    variant: 'tinted',
  },
};

export const Variants: StoryFn<typeof Card> = () => (
  <>
    {Object.entries(VariantsMap).map(([key, value]) => (
      <Card key={key} {...value}>
        <Card.Block>
          <Paragraph>
            {Object.entries(value).map(([v, k]) => (
              <Fragment key={v}>
                {v}: {k}
                <br />
              </Fragment>
            ))}
          </Paragraph>
        </Card.Block>
      </Card>
    ))}
  </>
);

export const Media: Story = () => (
  <>
    <Card data-color='neutral'>
      <Card.Block>
        <img src={cat1} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading>Card Neutral</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
    <Card data-color='neutral'>
      <Card.Block>
        <Heading>Card Neutral</Heading>
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
  <Card data-color='neutral' style={{ maxWidth: '320px' }}>
    <Card.Block>
      <iframe
        data-chromatic='ignore'
        src='https://player.vimeo.com/video/863563441?app_id=122963&amp;title=0&amp;byline=0&amp;portrait=0&amp;dnt=1'
        width='320px'
        height='179px'
        allow='autoplay; fullscreen; picture-in-picture'
        title='30 år med digitalt innsyn'
      ></iframe>
    </Card.Block>
    <Card.Block>
      <Heading>
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
  <>
    <Card>
      <Card.Block>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Heading>Rolle 1</Heading>
          <Button variant='secondary' data-color='danger' data-size='sm'>
            <TrashFillIcon aria-hidden />
            Fjern
          </Button>
        </div>
      </Card.Block>
      <Card.Block>
        <Field>
          <Label>Velg rolle</Label>
          <Select>
            {options.map(({ value, label }, index) => (
              <Select.Option key={index} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Field>
        <Textfield label='Fødsels- eller d-nummer' />
        <Textfield label='Etternavn' />
      </Card.Block>
      <Card.Block>
        <Button variant='secondary' data-color='accent' data-size='sm'>
          Legg til rolle
          <PlusIcon aria-hidden />
        </Button>
      </Card.Block>
    </Card>
    <Card data-color='neutral'>
      <Card.Block>
        <img src={cat1} alt='katt' />
      </Card.Block>
      <Card.Block>
        <Heading>Card Neutral</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this.
        </Paragraph>
      </Card.Block>
    </Card>
  </>
);

Composed.parameters = {
  customStyles: {
    display: 'grid',
    gap: 'var(--ds-size-4)',
    gridColumn: '1 / -1',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px , 1fr))',
    width: '100%',
  },
};

export const WithLink: Story = (args) => (
  <>
    <Card {...args} data-color='brand1'>
      <Card.Block>
        <img src={cat5} alt='' />
      </Card.Block>
      <Card.Block>
        <Heading>
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
        <Paragraph data-size='sm'>Footer text</Paragraph>
      </Card.Block>
    </Card>
    <Card {...args} data-color='neutral'>
      <Card.Block>
        <Heading>
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
        <Paragraph data-size='sm'>Footer text</Paragraph>
      </Card.Block>
      <Card.Block>
        <img src={cat5} alt='' />
      </Card.Block>
    </Card>
  </>
);

export const AsLink: Story = (args) => (
  <>
    <Card {...args} data-color='brand1' asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Card.Block>
          <Heading>Link Card with blocks</Heading>
        </Card.Block>
        <Card.Block>
          <Paragraph>
            Most provide as with carried business are much better more the
            perfected designer.
          </Paragraph>
        </Card.Block>
      </a>
    </Card>
    <Card {...args} data-color='neutral' asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Heading>Link Card</Heading>
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
    <Card {...args} data-color='brand1' asChild>
      <button type='button'>
        <Card.Block>
          <Heading>Button Card with blocks</Heading>
        </Card.Block>
        <Card.Block>
          <Paragraph>
            Most provide as with carried business are much better more the
            perfected designer.
          </Paragraph>
        </Card.Block>
      </button>
    </Card>
    <Card {...args} data-color='neutral' asChild>
      <button type='button'>
        <Heading>Link Card</Heading>
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
      <Heading>Button Card with blocks</Heading>
    </Card.Block>
    <Card.Block>
      <Paragraph>
        Most provide as with carried business are much better more the perfected
        designer.
      </Paragraph>
    </Card.Block>
  </Card>
);
