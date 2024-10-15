'use client';
import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Container } from '@repo/components';

import classes from './page.module.css';

export default function Home() {
  return (
    <div className={classes.page}>
      <main>
        <Container>
          <div className={classes.row}>
            <Heading level={1} size='lg' className={classes.title}>
              Slik bruker du verktøyet
            </Heading>
            <Paragraph className={classes.ingress}>
              Her vil du lære hvordan du bruke temabyggeren til å bygge ditt
              eget tema. Du vil også finne anbefalinger fra designsystemet på
              fargevalg og informasjon rundt feilmeldinger som dukker opp i
              verktøyet.
            </Paragraph>

            <Heading level={2} size='md'>
              Valg av farger
            </Heading>
            <Paragraph>
              Når du skal velge en farge i verktøyet så er det enkelte ting det
              er viktig å være klar over.
            </Paragraph>

            <Heading level={3} size='sm'>
              Accent fargen
            </Heading>
            <Paragraph>
              Accent fargen blir brukt som farge for å lyse opp viktige
              elementer på en side. Det er derfor viktig at denne fargen er
              sterk nok for å skille seg tydelig ut fra bakgrunnen.
              Designsystemet anbefaler at fargen man velger har minst 3:1
              kontrast mot bakgrunnsfargene for å både støtte WCAG sitt{' '}
              <a href='https://www.uutilsynet.no/wcag-standarden/1411-kontrast-ikke-tekstlig-innhold-niva-aa/145'>
                1.4.11 Kontrast for ikke-tekstlig innhold{' '}
              </a>{' '}
              krav og gjøre kontrastfargen som blir generert hvit.
            </Paragraph>

            <Heading level={3} size='sm'>
              Neutral fargen
            </Heading>
            <Paragraph>
              Vi anbefaler minst 3:1 kontrast mot bakgrunnsfargene for neutral
              fargen også.{' '}
            </Paragraph>

            <Heading level={3} size='sm'>
              Brand fargene
            </Heading>
            <Paragraph>
              Base fargene for brand fargene blir ikke brukt på viktige
              elementer på komponentene som Designsystemet leverer. Det er
              derfor litt mer fleksibelt hvilken farge man velger. Om man ønsker
              å bruke disse base fargene på viktige elementer på siden så må man
              være klar over 3:1 og 4.5:1 kontrastkravene til WCAG for AA.
            </Paragraph>

            <Heading level={2} size='md'>
              Feilmeldinger og ting å være obs på
            </Heading>
            <Paragraph>
              Temabyggeren lar deg velge 5 farger for å bygge et tema: Accent,
              Neutral, Brand 1, Brand 2 og Brand 3. Disse fargekodene vil bli
              til <code>Base Default</code> i fargeskalaene. Det er derfor
              enkelte ting man må passe på når man velger en farge for at det
              skal fungere optimalt i systemet.
            </Paragraph>

            <Heading level={3} size='sm'>
              Fargen har mindre enn 3:1 kontrast mot bakgrunnsfargene
            </Heading>

            <img src='img/test.png' alt='' />

            <Paragraph>
              Om du velger en farge som har mindre enn 3:1 kontrast mot
              bakgrunnsfargene så vil du få en advarsel om dette i verktøyet.
              Det er spesielt viktig at <code>Accent</code> og{' '}
              <code>Neutral</code> fargene er innenfor denne kontrastgrensen
              fordi <code>Base</code> fargene blir brukt på for eksempel{' '}
              <code>Button</code> og <code>Checkbox</code> komponentene. Mindre
              kontrast enn dette bryter WCAG kravet:{' '}
              <a href='https://www.uutilsynet.no/wcag-standarden/1411-kontrast-ikke-tekstlig-innhold-niva-aa/145'>
                1.4.11 Kontrast for ikke-tekstlig innhold{' '}
              </a>
              . For Brand fargene er dette mindre viktig siden det ikke brukes{' '}
              <code>Base</code> farger på viktige elementer på siden. Det er
              viktig å være klar over dette om man velger å bruke{' '}
              <code>Base</code> fargene til å lage sine egne ting.
            </Paragraph>
          </div>
        </Container>
      </main>
    </div>
  );
}
