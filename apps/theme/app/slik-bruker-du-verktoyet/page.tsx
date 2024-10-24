'use client';
import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { Container } from '@repo/components';

import classes from './page.module.css';

export default function Home() {
  return (
    <div className={classes.page}>
      <main>
        <Container>
          <div className={classes.row}>
            <Heading level={1} data-size='lg' className={classes.title}>
              Slik bruker du verktøyet
            </Heading>
            <Paragraph className={classes.ingress}>
              Her vil du lære hvordan du bruker temabyggeren til å skape ditt
              eget tema. I tillegg får du anbefalinger fra designsystemet om
              fargevalg, samt veiledning for å håndtere feilmeldinger som kan
              oppstå i verktøyet. Mer informasjon vil komme her etterhvert som
              temabyggeren blir ferdigstilt.
            </Paragraph>

            <Heading level={2} data-size='md'>
              Hva er et tema?
            </Heading>

            <Paragraph>
              Et tema er en samling av design tokens som kan overstyres via
              temabyggeren for å skape sitt eget unike visuelle utrykk. Akkuratt
              nå er det kun farger som kan overstyres, men vi jobber med å
              utvide med flere ting i fremtiden. Det neste som kommer er
              mulighet for å endre på fonter og border-radius. Vi vil også legge
              opp til at man kan ha flere forskjellige temaer samtidig om man
              skulle trenge det.
            </Paragraph>

            <Heading level={2} data-size='md'>
              Farger og WCAG
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
            <Heading level={2} data-size='md'>
              Valg av Accentfarge
            </Heading>
            <Paragraph>
              For at <code>Accent - Base</code> fargene skal skille seg tydelig
              ut fra andre elementer på en side, så er det viktig at disse har
              god kontrast mot bakgrunnsfargene. <code>Accent</code> er ment for
              å lyse opp og trekke oppmerksomhet til viktige elementer på
              nettsiden. Kontrastkravet sier at fargen som blir valgt må ha
              minst 3:1 kontrast mot bakgrunnsfargene. Det er ikke alltid
              sikkert at det å ligge akkuratt innenfor 3:1 kravet er godt nok
              visuelt for å skape et tydelig skille mot andre elementer på
              siden. Designsystemet anbefaler derfor å velge en relativt mørk{' '}
              <code>Accent</code> farge for å sikre at fargen skiller seg godt
              ut fra bakgrunnen. Blåfargen som er valgt som standard i verktøyet
              har for eksempel 6:1 kontrast mot bakgrunnsfargene.
            </Paragraph>
          </div>
        </Container>
      </main>
    </div>
  );
}
