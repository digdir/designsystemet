'use client';
import {
  Alert,
  Heading,
  Ingress,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';
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
            <Ingress className={classes.ingress}>
              Her vil du lære hvordan du kan bruke teambyggeren til å bygge ditt
              eget tema. Du vil også finne anbefalinger fra designsystemet på
              fargevalg og informasjon rundt feilmeldinger som dukker opp i
              verktøyet.
            </Ingress>

            <Alert size='md'>
              <Paragraph>
                Lurer du på hva token navnene betyr og hvordan du skal bruke
                fargene?
                <br /> Les mer om dette på{' '}
                <Link href='#'>tokenforklaringen</Link> på designsystemet.no.
              </Paragraph>
            </Alert>

            <Heading level={2} size='md'>
              Valg av farger og feilmeldinger
            </Heading>
            <Paragraph>
              Temabyggeren lar deg velge 5 farger: Accent, Neutral, Brand1,
              Brand2 og Brand3. Disse fargekodene vil bli til Base Default i
              fargeskalaene. Det er derfor enkelte ting man må passe på når man
              velger en farge for at det skal fungere optimalt i systemet.
            </Paragraph>

            <Heading level={3} size='sm'>
              Den valgte fargen har mindre enn 3:1 kontrast mot bakgrunnsfargene
            </Heading>
            <Paragraph>
              Om du velger en farge som har mindre enn 3:1 kontrast mot
              bakgrunnsfargene så vil du få ein advarsel om dette i verktøyet.
              Det er spesielt viktig at Accent og Neutral fargen har mer
              kontrast enn dette fordi disse fargene blir brukt på for eksempel
              Button og Checkbox.
            </Paragraph>

            <Heading level={3} size='sm'>
              Neutral farge
            </Heading>
            <Paragraph>ff</Paragraph>

            <Heading level={3} size='sm'>
              Brand farger
            </Heading>
            <Paragraph>ff</Paragraph>

            <Heading level={2} size='md'>
              Border radius
            </Heading>
            <Paragraph>ff</Paragraph>

            <Heading level={2} size='md'>
              WCAG kontrastmodus
            </Heading>
            <Paragraph>ff</Paragraph>
            <img src='img/1080p.jpg' alt='' />
          </div>
        </Container>
      </main>
    </div>
  );
}
