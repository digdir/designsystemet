import type { Meta, StoryFn } from '@storybook/react-vite';

import { useState } from 'react';
import {
  Fieldset,
  Heading,
  Paragraph,
  type Size,
  ToggleGroup,
  useMediaQuery,
} from '../src';

const meta: Meta = {
  title: 'Komponenter/Typography',
};

export default meta;

const sizes: (Size | 'auto')[] = ['sm', 'md', 'lg', 'auto'];

type ControlsProps = {
  size: Size | 'auto';
  setSize: (size: Size | 'auto') => void;
};

const Controls = ({ size, setSize }: ControlsProps) => {
  return (
    <div data-size='sm'>
      <Fieldset>
        <Fieldset.Legend>
          Størrelse <code data-font-size='xs'>(data-size)</code>
        </Fieldset.Legend>
        <ToggleGroup value={size} onChange={(val) => setSize(val as Size)}>
          {sizes.map((size) => (
            <ToggleGroup.Item key={size} value={size}>
              {size}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </Fieldset>
    </div>
  );
};

export const EksempelTekst: StoryFn = () => {
  const isMedium = useMediaQuery('(min-width: 768px)');
  const isLarge = useMediaQuery('(min-width: 1200px)');
  const [sizeControl, setSizeControl] = useState<Size | 'auto'>('auto');
  const size =
    sizeControl === 'auto'
      ? (isLarge && 'lg') || (isMedium && 'md') || 'sm'
      : sizeControl;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-4)',
      }}
    >
      <Controls size={sizeControl} setSize={setSizeControl} />
      <div data-size={size}>
        <Heading
          level={1}
          data-font-size='xl'
          style={{ marginBottom: 'var(--ds-size-5)' }}
        >
          Samordnet registermelding (H1)
        </Heading>

        <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }} variant='long'>
          Her kan du registrere nye virksomheter, som for eksempel
          enkeltpersonforetak, foreninger, aksjeselskap, ansvarlige selskap,
          samvirkeforetak og stiftelser. De aller fleste organisasjonsformene
          kan bruke denne tjenesten.
        </Paragraph>

        <Heading
          level={2}
          data-font-size='lg'
          style={{ marginBottom: 'var(--ds-size-4)' }}
        >
          Når skal du bruke skjemaet? (H2)
        </Heading>

        <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
          Denne tjenesten kan du bruke for å melde opplysninger til
          Enhetsregisteret, Foretaksregisteret, Frivillighetsregisteret, NAV
          Aa-registeret, Virksomhets- og foretaksregisteret hos SSB,
          Stiftelsesregisteret og Skattedirektoratets register over upersonlige
          skattytere.
        </Paragraph>

        <Heading
          level={3}
          data-font-size='md'
          style={{ marginBottom: 'var(--ds-size-3)' }}
        >
          Signering (H3)
        </Heading>

        <Paragraph variant='short' style={{ marginBottom: 'var(--ds-size-2)' }}>
          Når du skal signere meldingen vil du motta en signeringsoppgave i
          meldingsboksen din i Altinn. Meldingen blir ikke sendt til behandling
          før alle har signert.
        </Paragraph>

        <Heading
          level={4}
          data-font-size='sm'
          style={{ marginBottom: 'var(--ds-size-2)' }}
        >
          Krav om rolle for signering (H4)
        </Heading>

        <Paragraph style={{ marginBottom: 'var(--ds-size-3)' }}>
          For å signere på vegne av en virksomhet, trenger du Altinn-rollen
          Signerer av Samordnet registermelding. Du kan se hvilke roller du har
          for en aktør på menypunktet Profil, Skjema og tjenester du har
          rettighet til. Om du ikke har disse rollene, må du få noen som har
          rollene til å delegere dem til deg.
        </Paragraph>

        <Heading
          level={5}
          data-font-size='xs'
          style={{ marginBottom: 'var(--ds-size-3)' }}
        >
          Personvern (H5)
        </Heading>

        <Paragraph variant='short' style={{ marginBottom: 'var(--ds-size-2)' }}>
          Personvernerklæringen gir informasjon om hvilke personopplysninger vi
          behandler, hvordan disse blir behandlet og hvilke rettigheter du har.
        </Paragraph>
      </div>
    </div>
  );
};

export const EksempelTekstDark: StoryFn = () => (
  <div data-color-scheme='dark'>
    <Heading
      level={1}
      data-font-size='xl'
      style={{ marginBottom: 'var(--ds-size-2)' }}
    >
      Samordnet registermelding (H1)
    </Heading>

    <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }} variant='long'>
      Her kan du registrere nye virksomheter, som for eksempel
      enkeltpersonforetak, foreninger, aksjeselskap, ansvarlige selskap,
      samvirkeforetak og stiftelser. De aller fleste organisasjonsformene kan
      bruke denne tjenesten.
    </Paragraph>

    <Heading
      level={2}
      data-font-size='lg'
      style={{ marginBottom: 'var(--ds-size-2)' }}
    >
      Når skal du bruke skjemaet? (H2)
    </Heading>

    <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
      Denne tjenesten kan du bruke for å melde opplysninger til
      Enhetsregisteret, Foretaksregisteret, Frivillighetsregisteret, NAV
      Aa-registeret, Virksomhets- og foretaksregisteret hos SSB,
      Stiftelsesregisteret og Skattedirektoratets register over upersonlige
      skattytere.
    </Paragraph>

    <Heading
      level={3}
      data-font-size='md'
      style={{ marginBottom: 'var(--ds-size-2)' }}
    >
      Signering (H3)
    </Heading>

    <Paragraph variant='short' style={{ marginBottom: 'var(--ds-size-2)' }}>
      Når du skal signere meldingen vil du motta en signeringsoppgave i
      meldingsboksen din i Altinn. Meldingen blir ikke sendt til behandling før
      alle har signert.
    </Paragraph>

    <Heading
      level={4}
      data-font-size='sm'
      style={{ marginBottom: 'var(--ds-size-2)' }}
    >
      Krav om rolle for signering (H4)
    </Heading>

    <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
      For å signere på vegne av en virksomhet, trenger du Altinn-rollen Signerer
      av Samordnet registermelding. Du kan se hvilke roller du har for en aktør
      på menypunktet Profil, Skjema og tjenester du har rettighet til. Om du
      ikke har disse rollene, må du få noen som har rollene til å delegere dem
      til deg.
    </Paragraph>

    <Heading
      level={5}
      data-font-size='xs'
      style={{ marginBottom: 'var(--ds-size-2)' }}
    >
      Personvern (H5)
    </Heading>

    <Paragraph variant='short' style={{ marginBottom: 'var(--ds-size-2)' }}>
      Personvernerklæringen gir informasjon om hvilke personopplysninger vi
      behandler, hvordan disse blir behandlet og hvilke rettigheter du har.
    </Paragraph>
  </div>
);
