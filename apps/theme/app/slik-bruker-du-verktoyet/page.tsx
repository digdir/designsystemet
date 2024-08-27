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
              eget tema. Du vil også finne anbefalinger fra designsystmet på
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
              Fargevalg
            </Heading>
            <Paragraph>ff</Paragraph>

            <Heading level={3} size='sm'>
              Accent farge
            </Heading>
            <Paragraph>ff</Paragraph>

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
