import {
  Button,
  ErrorSummary,
  Link,
  List,
  Textfield,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  return (
    <ErrorSummary>
      <ErrorSummary.Heading>
        For å gå videre må du rette opp følgende feil:
      </ErrorSummary.Heading>
      <List.Unordered>
        <List.Item>
          <Link href='#'>Fødselsdato kan ikke være etter år 2005</Link>
        </List.Item>
        <List.Item>
          <Link href='#'>Telefonnummer kan kun inneholde siffer</Link>
        </List.Item>
        <List.Item>
          <Link href='#'>E-post må være gyldig</Link>
        </List.Item>
      </List.Unordered>
    </ErrorSummary>
  );
};

export const PreviewEn = () => {
  return (
    <ErrorSummary>
      <ErrorSummary.Heading>
        To proceed, you must correct the following errors:
      </ErrorSummary.Heading>
      <List.Unordered>
        <List.Item>
          <Link href='#'>Birthdate cannot be after the year 2005</Link>
        </List.Item>
        <List.Item>
          <Link href='#'>Phone number can only contain digits</Link>
        </List.Item>
        <List.Item>
          <Link href='#'>Email must be valid</Link>
        </List.Item>
      </List.Unordered>
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
        <List.Unordered>
          <List.Item>
            <Link href='#fornavn'>Fornavn må være minst 2 tegn</Link>
          </List.Item>
          <List.Item>
            <Link href='#telefon'>Telefonnummer kan kun inneholde siffer</Link>
          </List.Item>
        </List.Unordered>
      </ErrorSummary>
    </>
  );
};

export const WithFormEn = () => {
  return (
    <>
      <Textfield
        label='First name'
        id='first-name'
        error='First name must be at least 2 characters'
      />

      <Textfield
        label='Phone'
        id='phone'
        type='tel'
        error='Phone number can only contain digits'
      />

      <ErrorSummary>
        <ErrorSummary.Heading>
          To proceed, you must correct the following errors:
        </ErrorSummary.Heading>
        <List.Unordered>
          <List.Item>
            <Link href='#first-name'>
              First name must be at least 2 characters
            </Link>
          </List.Item>
          <List.Item>
            <Link href='#phone'>Phone number can only contain digits</Link>
          </List.Item>
        </List.Unordered>
      </ErrorSummary>
    </>
  );
};

export const ShowHide = () => {
  const [show, setShow] = useState(false);

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
        <ErrorSummary>
          <ErrorSummary.Heading>
            For å gå videre må du rette opp følgende feil:
          </ErrorSummary.Heading>
          <List.Unordered>
            <List.Item>
              <Link href='#fornavn'>Fornavn må være minst 2 tegn</Link>
            </List.Item>
            <List.Item>
              <Link href='#telefon'>
                Telefonnummer kan kun inneholde siffer
              </Link>
            </List.Item>
          </List.Unordered>
        </ErrorSummary>
      )}
    </>
  );
};

export const ShowHideEn = () => {
  const [show, setShow] = useState(false);

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
          {show ? 'Hide' : 'Submit form'}
        </Button>
      </div>
      {show && (
        <ErrorSummary>
          <ErrorSummary.Heading>
            To proceed, you must correct the following errors:
          </ErrorSummary.Heading>
          <List.Unordered>
            <List.Item>
              <Link href='#first-name'>
                First name must be at least 2 characters
              </Link>
            </List.Item>
            <List.Item>
              <Link href='#phone'>Phone number can only contain digits</Link>
            </List.Item>
          </List.Unordered>
        </ErrorSummary>
      )}
    </>
  );
};
