import {
  Button,
  Card,
  Details,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';
import { ChevronDownUpIcon, ChevronUpDownIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

export const Preview = () => {
  return (
    <Details>
      <Details.Summary>
        Hvem kan registrere seg i Frivillighetsregisteret?
      </Details.Summary>
      <Details.Content>
        For å kunne bli registrert i Frivillighetsregisteret, må organisasjonen
        drive frivillig virksomhet. Det er bare foreninger, stiftelser og
        aksjeselskap som kan registreres. Virksomheten kan ikke dele ut midler
        til fysiske personer. Virksomheten må ha et styre.
      </Details.Content>
    </Details>
  );
};

export const PreviewEn = () => {
  return (
    <Details>
      <Details.Summary>
        Who can register in the Volunteer Register?
      </Details.Summary>
      <Details.Content>
        To be registered in the Volunteer Register, the organization must
        conduct voluntary activities. Only associations, foundations, and
        limited companies can be registered. The business cannot distribute
        funds to individuals. The business must have a board.
      </Details.Content>
    </Details>
  );
};

export const InCard = () => {
  return (
    <Card data-color='neutral'>
      <Details>
        <Details.Summary>Vedlegg</Details.Summary>
        <Details.Content>Vedlegg 1, vedlegg 2, vedlegg 3</Details.Content>
      </Details>
    </Card>
  );
};

export const InCardWithColor = () => {
  return (
    <>
      <Card data-color='brand1'>
        <Details>
          <Details.Summary>
            Hvordan får jeg tildelt et jegernummer?
          </Details.Summary>
          <Details.Content>
            Du vil automatisk få tildelt jegernummer og bli registrert i
            Jegerregisteret når du har bestått jegerprøven.
          </Details.Content>
        </Details>
        <Details>
          <Details.Summary>
            Jeg har glemt jegernummeret mitt. Hvor finner jeg dette?
          </Details.Summary>
          <Details.Content>
            <Paragraph>
              Du kan finne dette ved å logge inn på{' '}
              <Link href='https://minjegerside.brreg.no/'>Min side</Link>
            </Paragraph>
          </Details.Content>
        </Details>
      </Card>
      <br />
      <Card data-color='brand1' data-variant='tinted'>
        <Details>
          <Details.Summary>
            Hvordan får jeg tildelt et jegernummer?
          </Details.Summary>
          <Details.Content>
            Du vil automatisk få tildelt jegernummer og bli registrert i
            Jegerregisteret når du har bestått jegerprøven.
          </Details.Content>
        </Details>
      </Card>
    </>
  );
};

export const InCardWithColorEn = () => {
  return (
    <>
      <Card data-color='brand1'>
        <Details>
          <Details.Summary>
            How do I get assigned a hunter number?
          </Details.Summary>
          <Details.Content>
            You will automatically be assigned a hunter number and registered in
            the Hunter Register when you have passed the hunter's exam.
          </Details.Content>
        </Details>
        <Details>
          <Details.Summary>
            I have forgotten my hunter number. Where can I find it?
          </Details.Summary>
          <Details.Content>
            <Paragraph>
              You can find this by logging in to{' '}
              <Link href='https://minjegerside.brreg.no/'>My Page</Link>
            </Paragraph>
          </Details.Content>
        </Details>
      </Card>
      <br />
      <Card data-color='brand1' data-variant='tinted'>
        <Details>
          <Details.Summary>
            How do I get assigned a hunter number?
          </Details.Summary>
          <Details.Content>
            You will automatically be assigned a hunter number and registered in
            the Hunter Register when you have passed the hunter's exam.
          </Details.Content>
        </Details>
      </Card>
    </>
  );
};

export const Controlled = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const isOpen = [open1, open2].every(Boolean);
  const toggleOpen = () => {
    setOpen1(!isOpen);
    setOpen2(!isOpen);
  };

  return (
    <>
      <Button variant='tertiary' onClick={toggleOpen} data-size='sm'>
        {isOpen ? (
          <>
            <ChevronDownUpIcon aria-hidden />
            Close both
          </>
        ) : (
          <>
            <ChevronUpDownIcon aria-hidden />
            Open both
          </>
        )}
      </Button>
      <br />

      <Details open={open1} onToggle={() => setOpen1(!open1)}>
        <Details.Summary>Enkeltpersonforetak</Details.Summary>
        <Details.Content>
          Skal du starte for deg selv? Enkeltpersonforetak er ofte den enkleste
          måten å etablere bedrift på. Denne organisasjonsformen har både
          fordeler og ulemper. Det gir deg stor grad av frihet, men kan også gi
          betydelig risiko fordi du har personlig ansvar for økonomien.
        </Details.Content>
      </Details>
      <Details open={open2} onToggle={() => setOpen2(!open2)}>
        <Details.Summary>Aksjeselskap (AS)</Details.Summary>
        <Details.Content>
          Planlegger du å starte næringsvirksomhet alene eller sammen med andre?
          Innebærer næringsvirksomheten en økonomisk risiko? Vil du ha
          rettigheter som arbeidstaker og muligheten til at andre kan investere
          i selskapet ditt? Da kan aksjeselskap være en hensiktsmessig
          organisasjonsform.
        </Details.Content>
      </Details>
    </>
  );
};
