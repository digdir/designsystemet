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
              Her vil du lære hvordan du bruker temabyggeren til å skape ditt
              eget tema. I tillegg får du anbefalinger fra designsystemet om
              fargevalg, samt veiledning for å håndtere feilmeldinger som kan
              oppstå i verktøyet. Mer informasjon vil komme her etterhvert som
              temabyggeren blir ferdigstilt.
            </Paragraph>

            <Heading level={2} size='md'>
              Valg av farger
            </Heading>
            <Paragraph>
              Når du velger en farge i verktøyet så vil{' '}
              <code>Base Default</code> fargen få den samme hex koden som fargen
              du har valgt. Om fargen har mindre enn 3:1 kontast mot
              bakgrunnsfargene så vil du få en advarsel om dette i verktøyet.
              WCAG kravet{' '}
              <Link href='https://www.uutilsynet.no/wcag-standarden/1411-kontrast-ikke-tekstlig-innhold-niva-aa/145#:~:text=KORT%20FORTALT%3A%20Ikke%2Dtekstlig%20innhold,som%20ligger%20ved%20siden%20av.'>
                1.4.11 Kontrast for ikke-tekstlig innhold (Nivå AA)
              </Link>{' '}
              sier at "Ikke-tekstlig innhold skal ha et kontrastforhold på minst
              3:1 mot farge(r) som ligger ved siden av". Designsystemet bruker
              for eksempel <code>Accent - Base Default</code> fargen på både{' '}
              <code>Checkbox</code> og <code>Switch</code> når de er i valgt
              tilstand.
            </Paragraph>
            <Paragraph>
              <br />
              <code>Accent</code> og <code>Neutral</code> fargene må begge ha
              minst 3:1 kontrast mot bakgrunnsfargene for å ikke bryte kravet
              som er nevnt over. Dette er fordi disse fargene blir brukt inne i
              komponentene til Designsystemet. Når det gjelder{' '}
              <code>Brand</code> fargene så er ikke <code>Base</code> fargene
              brukt på viktige interaktive eller meningsbærende elementer inne i
              komponentene. Det er derfor litt mer fleksibilitet i valg av
              farger her. Det er fortsatt viktig å tenke på kontrasten mot
              bakgrunnsfargene om <code>Base</code> fargene skal brukes på
              aktive brukergrensesnittkomponenter eller meningsbærende grafikk.
            </Paragraph>
          </div>
        </Container>
      </main>
    </div>
  );
}
