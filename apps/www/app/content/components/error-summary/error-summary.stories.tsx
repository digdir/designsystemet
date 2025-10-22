import { Button, ErrorSummary, Textfield } from '@digdir/designsystemet-react';
import { useEffect, useRef, useState } from 'react';

export const Preview = () => {
  return (
    <ErrorSummary>
      <ErrorSummary.Heading>
        For å gå videre må du rette opp følgende feil:
      </ErrorSummary.Heading>
      <ErrorSummary.List>
        <ErrorSummary.Item>
          <ErrorSummary.Link href='#'>
            Fødselsdato kan ikke være etter år 2005
          </ErrorSummary.Link>
        </ErrorSummary.Item>
        <ErrorSummary.Item>
          <ErrorSummary.Link href='#'>
            Telefonnummer kan kun inneholde siffer
          </ErrorSummary.Link>
        </ErrorSummary.Item>
        <ErrorSummary.Item>
          <ErrorSummary.Link href='#'>E-post må være gyldig</ErrorSummary.Link>
        </ErrorSummary.Item>
      </ErrorSummary.List>
    </ErrorSummary>
  );
};

export const WithForm = () => {
  return (
    <>
      <Textfield
        label='Fornavn'
        id='fornavn'
        error='Fornavn må være minst 2 tegn'
      />

      <Textfield
        label='Telefon'
        id='telefon'
        type='tel'
        error='Telefonnummer kan kun inneholde siffer'
      />

      <ErrorSummary>
        <ErrorSummary.Heading>
          For å gå videre må du rette opp følgende feil:
        </ErrorSummary.Heading>
        <ErrorSummary.List>
          <ErrorSummary.Item>
            <ErrorSummary.Link href='#fornavn'>
              Fornavn må være minst 2 tegn
            </ErrorSummary.Link>
          </ErrorSummary.Item>
          <ErrorSummary.Item>
            <ErrorSummary.Link href='#telefon'>
              Telefonnummer kan kun inneholde siffer
            </ErrorSummary.Link>
          </ErrorSummary.Item>
        </ErrorSummary.List>
      </ErrorSummary>
    </>
  );
};

export const ShowHide = () => {
  const [show, setShow] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      summaryRef.current?.focus();
    }
  }, [show]);

  return (
    <>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          marginBottom: 'var(--ds-size-4)',
        }}
      >
        <Button onClick={() => setShow(!show)}>
          {show ? 'Skjul' : 'Send inn skjema'}
        </Button>
      </div>
      {show && (
        <ErrorSummary ref={summaryRef}>
          <ErrorSummary.Heading>
            For å gå videre må du rette opp følgende feil:
          </ErrorSummary.Heading>
          <ErrorSummary.List>
            <ErrorSummary.Item>
              <ErrorSummary.Link href='#fornavn'>
                Fornavn må være minst 2 tegn
              </ErrorSummary.Link>
            </ErrorSummary.Item>
            <ErrorSummary.Item>
              <ErrorSummary.Link href='#telefon'>
                Telefonnummer kan kun inneholde siffer
              </ErrorSummary.Link>
            </ErrorSummary.Item>
          </ErrorSummary.List>
        </ErrorSummary>
      )}
    </>
  );
};
