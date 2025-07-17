import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
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
          Størrelse <code>(data-size)</code>
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
          data-size='xl'
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
          data-size='lg'
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
          data-size='md'
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
          data-size='sm'
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
          data-size='xs'
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
      data-size='xl'
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
      data-size='lg'
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
      data-size='md'
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
      data-size='sm'
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
      data-size='xs'
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

const Headings = () => (
  <>
    <Heading data-size='2xl' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a 2xl heading
    </Heading>
    <Heading data-size='xl' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is an xl heading
    </Heading>
    <Heading data-size='lg' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a lg heading
    </Heading>
    <Heading data-size='md' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a md heading
    </Heading>
    <Heading data-size='sm' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a sm heading
    </Heading>
    <Heading data-size='xs' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is an xs heading
    </Heading>
    <Heading data-size='2xs' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a 2xs heading
    </Heading>
  </>
);

export const HeadingsInVariousSizes: StoryFn = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--ds-size-6)',
    }}
  >
    <div data-size='sm' data-testid='small'>
      <div>Size mode small</div>
      <Headings />
    </div>
    <div style={{ display: 'flex', gap: 'var(--ds-size-3)' }}>
      <div data-testid='implicit-medium'>
        Implicit size mode medium
        <Headings />
      </div>
      <div data-size='md' data-testid='medium'>
        Explicit size mode medium
        <Headings />
      </div>
    </div>
    <div data-size='lg' data-testid='large'>
      Size mode large
      <Headings />
    </div>
  </div>
);
HeadingsInVariousSizes.play = async ({ canvasElement, step }) => {
  const canvas = within(canvasElement);
  const small = canvas.getByTestId('small');
  const implicitMedium = canvas.getByTestId('implicit-medium');
  const explicitMedium = canvas.getByTestId('medium');
  const large = canvas.getByTestId('large');

  await step('size mode small: expect bottom margins to be equal', () =>
    expectEqualBottomMargins(small),
  );
  await step(
    'implicit size mode medium: expect bottom margins to be equal',
    () => expectEqualBottomMargins(implicitMedium),
  );
  await step(
    'explicit size mode medium: expect bottom margins to be equal',
    () => expectEqualBottomMargins(explicitMedium),
  );
  await step('size mode large: expect bottom margins to be equal', () =>
    expectEqualBottomMargins(large),
  );

  await step(
    'size mode medium: headings should be identical whether medium is impicit or explicit',
    async () => {
      const implicitHeadings = within(implicitMedium).getAllByRole('heading');
      const explicitHeadings = within(explicitMedium).getAllByRole('heading');
      for (let i = 0; i < implicitHeadings.length; i++) {
        const implicit = implicitHeadings[i];
        const explicit = explicitHeadings[i];
        await expect(getComparableComputedStyle(implicit)).toEqual(
          getComparableComputedStyle(explicit),
        );
      }
    },
  );
};

function getComparableComputedStyle(element: HTMLElement) {
  const computed = getComputedStyle(element);
  return Object.fromEntries(
    Array.from(computed)
      .filter((prop) => !prop.startsWith('--'))
      .map((prop) => [prop, computed.getPropertyValue(prop)]),
  );
}

async function expectEqualBottomMargins(container: HTMLElement) {
  const headings = within(container).getAllByRole('heading');
  const margins = headings.map((h) => getComputedStyle(h).marginBottom);

  for (const margin of margins) {
    await expect(margin).toBe(margins[0]);
  }
}
