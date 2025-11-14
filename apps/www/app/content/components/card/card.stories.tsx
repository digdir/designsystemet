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
        <video controls preload='metadata' width='100%'>
          <source
            src='/videos/designsystemet/designsystemet-info.mp4'
            type='video/mp4'
          />
          <track
            label='Norwegian'
            kind='subtitles'
            srcLang='nb'
            src='/videos/designsystemet/designsystemet-info-no.vtt'
            default
          />
          <track
            label='English'
            kind='subtitles'
            srcLang='en'
            src='/videos/designsystemet/designsystemet-info-en.vtt'
          />
          Your browser does not support the video tag.
        </video>
      </Card.Block>
      <Card.Block>
        <Heading>Om Designsystemet</Heading>
        <Paragraph>
          Videoen over gir en kort introduksjon til hva Designsystemet er, og
          hvordan det kan brukes i utviklingen av digitale tjenester.
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
