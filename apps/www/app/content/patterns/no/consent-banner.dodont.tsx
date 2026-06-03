import { Button, Paragraph } from '@digdir/designsystemet-react';

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

export const DontButtons = () => {
  return (
    <>
      <Button variant='primary'>Nei, jeg vil ikke ha en bedre tjeneste</Button>
      <Button variant='primary'>Ja, jeg vil hjelpe til</Button>
      <Button variant='primary'>Godta anbefalte</Button>
      <Button variant='primary'>Bare nødvendige</Button>
      <Button variant='primary'>OK</Button>
      <Button variant='primary'>Jeg forstår</Button>
    </>
  );
};
