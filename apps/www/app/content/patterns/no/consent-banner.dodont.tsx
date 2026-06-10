import {
  Button,
  Checkbox,
  Divider,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';

export const DontNegations = () => {
  return (
    <Paragraph>
      Ønsker du at vi ikke skal lagre informasjon om deg og dine bruksmønstre?
    </Paragraph>
  );
};

export const DoNegations = () => {
  return (
    <Paragraph>Får vi samle informasjon om hvordan nettsiden brukes?</Paragraph>
  );
};

export const DontButtons1 = () => {
  return (
    <>
      <Button variant='primary'>Nei, jeg vil ikke ha en bedre tjeneste</Button>
      <Button variant='primary'>Ja, jeg vil hjelpe til</Button>
      <Button variant='primary'>Godta anbefalte</Button>
      <Button variant='primary'>OK</Button>
      <Button variant='primary'>Jeg forstår</Button>
    </>
  );
};

export const DoButtons1 = () => {
  return (
    <>
      <Button variant='primary'>Ja</Button>
      <Button variant='primary'>Nei</Button>
      <Divider />
      <Button variant='primary'> Godta</Button>
      <Button variant='primary'>Avslå</Button>
    </>
  );
};

export const DontButtons2 = () => {
  return <Button variant='primary'>Godta bare nødvendige</Button>;
};

export const DoButtons2 = () => {
  return (
    <>
      <Button variant='primary'>Ja</Button>
      <Button variant='primary'>Nei</Button>
    </>
  );
};

export const DontNecessaryCookiesCheckbox = () => {
  return (
    <div
      style={{
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-size-2)',
      }}
    >
      <Checkbox
        checked
        disabled
        label='Nødvendige informasjonskapsler'
        readOnly
      />
      <Checkbox label='Hvordan nettsiden brukes' />
    </div>
  );
};

export const DoNecessaryCookiesCheckbox = () => {
  return (
    <Paragraph>
      <Link href='#nodvendig-informasjon' style={{ color: 'inherit' }}>
        Vi lagrer også nødvendig informasjon
      </Link>{' '}
      som ikke kan velges bort. Dette gjør at nettsiden fungerer og er trygg.
    </Paragraph>
  );
};
