import { Divider, Paragraph } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <>
      <Paragraph>
        Divider er brukt for å dele opp innhold i mindre deler.
      </Paragraph>
      <Divider />
      <Paragraph>
        Den kan også brukes for å skille innhold som er relatert til hverandre.
      </Paragraph>
    </>
  );
};

export const PreviewEn = () => {
  return (
    <>
      <Paragraph>
        Divider is used to separate content into smaller parts.
      </Paragraph>
      <Divider />
      <Paragraph>
        It can also be used to separate content that is related to each other.
      </Paragraph>
    </>
  );
};
