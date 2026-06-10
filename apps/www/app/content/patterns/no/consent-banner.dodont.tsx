import {
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Link,
  Paragraph,
  useCheckboxGroup,
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
      <Button variant='primary'>Godta</Button>
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
  const { getCheckboxProps } = useCheckboxGroup({
    value: ['necessary'],
  });

  return (
    <Fieldset>
      <Fieldset.Legend>Hvilken informasjon kan vi lagre?</Fieldset.Legend>
      <Checkbox
        label='Nødvendige informasjonskapsler'
        {...getCheckboxProps({
          disabled: true,
        })}
      />
      <Checkbox label='Statistikk om hvordan nettsiden brukes' />
    </Fieldset>
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
