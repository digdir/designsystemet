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
      <Heading>Lykkeland Barneskole</Heading>
      <Paragraph>
        Lykkeland Barneskole er ein trygg og inkluderande nærskule der leik,
        læring og nysgjerrigheit går hand i hand.
      </Paragraph>
      <Paragraph data-size='sm'>Solslett kommune</Paragraph>
    </Card>
  );
};

export const PreviewEn = () => {
  return (
    <Card style={{ maxWidth: '320px' }} data-color='neutral'>
      <Heading>Lykkeland Primary School</Heading>
      <Paragraph>
        Lykkeland Primary School is a safe and inclusive local school where
        play, learning and curiosity go hand in hand.
      </Paragraph>
      <Paragraph data-size='sm'>Solslett Municipality</Paragraph>
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
    <Card data-color='neutral' style={{ maxWidth: '380px' }}>
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

export const MediaEn = () => {
  return (
    <Card data-color='neutral' style={{ maxWidth: '380px' }}>
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
        <Heading>About Designsystemet</Heading>
        <Paragraph>
          The video above provides a brief introduction to what Designsystemet
          is and how it can be used in the development of digital services.
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
            Myrkheim Museum
          </Link>
        </Heading>
        <Paragraph>
          Myrkheim Museum ligg i dalen mellom dei gamle fjelltoppane og viser
          utstillingar frå tida då dei fyrste reisefølgja kryssa landet. Her kan
          du utforske eldgamle kart, reiskapar frå dei store vandringane og
          forteljingar bevart av skogvaktarane.
        </Paragraph>
        <Paragraph data-size='sm'>Myrkheim Kulturvernråd</Paragraph>
      </Card.Block>
    </Card>
  );
};

export const WithLinkEn = () => {
  return (
    <Card data-color='neutral'>
      <Card.Block>
        <Heading>
          <Link
            href='https://designsystemet.no'
            target='_blank'
            rel='noopener noreferrer'
          >
            Myrkheim Museum
          </Link>
        </Heading>
        <Paragraph>
          The Myrkheim Museum lies in the valley between the old mountain peaks
          and displays exhibitions from the time when the first travelling
          companies crossed the land. Here you can explore ancient maps, tools
          from the great wanderings, and tales preserved by the wardens of the
          forests.
        </Paragraph>
        <Paragraph data-size='sm'>
          Myrkheim Council for Cultural Heritage
        </Paragraph>
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
          <Heading>Innstillinger og personvern</Heading>
        </Card.Block>
        <Card.Block>
          <Paragraph>
            Dette åpner en dialog der du kan oppdatere personvernvalg, justere
            innstillinger og tilpasse hvordan tjenesten behandler informasjonen
            din. Du kan se gjennom endringene før du lagrer.
          </Paragraph>
        </Card.Block>
      </button>
    </Card>
  );
};

export const AsButtonEn = () => {
  return (
    <Card asChild data-color='neutral'>
      <button type='button'>
        <Card.Block>
          <Heading>Settings and privacy</Heading>
        </Card.Block>
        <Card.Block>
          <Paragraph>
            This opens a dialogue where you can update your privacy choices,
            adjust settings, and customise how the service handles your
            information. You can review your changes before saving.
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
        <Heading>Vandrefeber</Heading>
      </Card.Block>
      <Card.Block>
        <Paragraph>
          Symptomer kan være uro i kroppen, skjerpet årvåkenhet og en tendens
          til å stadig se seg over skulderen. Tilstanden går vanligvis over
          etter et godt måltid og et trygt sted å hvile.
        </Paragraph>
      </Card.Block>
    </Card>
  );
};

export const AsGridEn = () => {
  return (
    <Card
      data-color='neutral'
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
    >
      <Card.Block>
        <Heading>Wanderer’s Fever</Heading>
      </Card.Block>
      <Card.Block>
        <Paragraph>
          Symptoms can include restlessness, heightened alertness, and a
          tendency to look over one’s shoulder. The condition usually eases
          after a good meal and a safe place to rest.
        </Paragraph>
      </Card.Block>
    </Card>
  );
};

export const AsGridImage = () => {
  return (
    <Card
      data-color='neutral'
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
    >
      <Card.Block style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src='/img/blog/miro.png'
          alt='Skjermbilde av et mirobrett med 200 deltakere og mange lapper'
        />
      </Card.Block>

      <Card.Block>
        <Heading>
          <Link
            href='/no/blog/why-we-need-a-common-design-system'
            target='_blank'
            rel='noopener noreferrer'
          >
            Derfor trenger vi et felles designsystem
          </Link>
        </Heading>
        <Paragraph>
          Høsten 2023 arrangerte vi en åpen presentasjon og mini-workshop om
          felles designsystem. Over 200 deltok og vi fikk 440 tilbakemeldinger
          på gevinster og utfordringer.
        </Paragraph>
      </Card.Block>
    </Card>
  );
};

export const AsGridImageEn = () => {
  return (
    <Card
      data-color='neutral'
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
    >
      <Card.Block style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src='/img/blog/miro.png'
          alt='Screenshot of a Miro board with 200 participants and numerous notes'
        />
      </Card.Block>

      <Card.Block>
        <Heading>
          <Link
            href='/no/blog/why-we-need-a-common-design-system'
            target='_blank'
            rel='noopener noreferrer'
          >
            Why we need a common design system
          </Link>
        </Heading>
        <Paragraph>
          In autumn 2023, we hosted an open presentation and mini-workshop on a
          shared design system. More than 200 people took part, and we received
          440 pieces of feedback on benefits and challenges.
        </Paragraph>
      </Card.Block>
    </Card>
  );
};
