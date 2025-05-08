import cat1 from '@assets/img/cats/Cat 1.jpg';
import cat5 from '@assets/img/cats/Cat 5.jpg';
import {} from '@navikt/aksel-icons';
import type { Meta, StoryFn } from '@storybook/react';

import { Card, type CardProps, Heading, Paragraph } from '../../';
import themeConfig from '../../../../theme/configs/designsystemet.config.json';

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

const colorVariants = [
  ...Object.keys(themeConfig.themes.designsystemet.colors.main),
  ...Object.keys(themeConfig.themes.designsystemet.colors.support),
  themeConfig.themes.designsystemet.colors.neutral,
];

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

const variants = ['default', 'tinted'];

export const Variants: StoryFn<typeof Card> = () => (
  <>
    {variants.map((variant) =>
      colorVariants.map((color) => (
        <Card
          key={variant}
          data-variant={variant}
          data-color={color as CardProps['data-color']}
        >
          <Card.Block>
            <Paragraph>
              {variant}: {color}
            </Paragraph>
          </Card.Block>
        </Card>
      )),
    )}
  </>
);

export const Media: Story = () => (
  <>
    <Card data-color='neutral'>
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

export const WithLink: Story = (args) => (
  <>
    <Card {...args}>
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
    <Card {...args} asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Card.Block>
          <Paragraph>Link card with asChild</Paragraph>
        </Card.Block>
      </a>
    </Card>
    <Card {...args} data-color='neutral' asChild>
      <a
        href='https://designsystemet.no'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Heading>Link Card with asChild</Heading>
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
    <Card {...args} asChild>
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
