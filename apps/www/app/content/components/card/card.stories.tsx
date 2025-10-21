import {
  Card,
  type CardProps,
  Heading,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <Card style={{ maxWidth: '320px' }} data-color='neutral'>
      <Heading>Card</Heading>
      <Paragraph>
        Most provide as with carried business are much better more the perfected
        designer. Writing slightly explain desk unable at supposedly about this
      </Paragraph>
      <Paragraph data-size='sm'>Footer text</Paragraph>
    </Card>
  );
};

export const Variants = () => {
  const colorVariants = ['accent', 'brand1', 'brand2', 'brand3', 'neutral'];
  const variants = ['default', 'tinted'];

  return (
    <>
      {variants.map((variant) =>
        colorVariants.map((color) => (
          <Card
            key={`${variant}-${color}`}
            data-variant={variant as 'default' | 'tinted'}
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
};

export const Media = () => {
  return (
    <Card data-color='neutral'>
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
        <Heading>Card Neutral</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
      </Card.Block>
    </Card>
  );
};

export const Video = () => {
  return (
    <Card data-color='neutral' style={{ maxWidth: '320px' }}>
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
          Det er i år 30 år sidan dei første forsøka med elektronisk postjournal
          i Noreg. Sjå opptak frå feiringa på Pressens Hus der det både var
          historiske tilbakeblikk og debatt om innsyn og openheit i
          forvaltninga.
        </Paragraph>
      </Card.Block>
    </Card>
  );
};

export const WithLink = () => {
  return (
    <Card data-color='neutral'>
      <Card.Block>
        <Heading>
          <Link
            href='https://designsystemet.no'
            target='_blank'
            rel='noopener noreferrer'
          >
            Link Card
          </Link>
        </Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer. Writing slightly explain desk unable at supposedly
          about this
        </Paragraph>
        <Paragraph data-size='sm'>Footer text</Paragraph>
      </Card.Block>
    </Card>
  );
};

export const AsLink = () => {
  return (
    <Card data-color='neutral' asChild>
      <a href='https://designsystemet.no' rel='noopener noreferrer'>
        <Heading>Link Card with asChild</Heading>
        <Paragraph>
          Most provide as with carried business are much better more the
          perfected designer.
        </Paragraph>
      </a>
    </Card>
  );
};

export const AsButton = () => {
  return (
    <Card asChild data-color='neutral'>
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
  );
};

export const AsGrid = () => {
  return (
    <Card
      data-color='neutral'
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
    >
      <Card.Block>
        <Heading>Button Card with blocks</Heading>
      </Card.Block>
      <Card.Block>
        <Paragraph>
          Most provide as with carried business are; much; better; more; the;
          perfected; designer.
        </Paragraph>
      </Card.Block>
    </Card>
  );
};
