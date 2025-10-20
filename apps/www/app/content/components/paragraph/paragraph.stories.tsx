import { Paragraph } from '@digdir/designsystemet-react';

export const Preview = () => (
  <Paragraph>
    Personvernerklæringen gir informasjon om hvilke personopplysninger vi
    behandler, hvordan disse blir behandlet og hvilke rettigheter du har.
  </Paragraph>
);

export const Sizes = () => (
  <>
    <Paragraph data-size='xl'>This is an xl paragraph</Paragraph>
    <Paragraph data-size='lg'>This is a lg paragraph</Paragraph>
    <Paragraph data-size='md'>This is a md paragraph</Paragraph>
    <Paragraph data-size='sm'>This is a sm paragraph</Paragraph>
    <Paragraph data-size='xs'>This is an xs paragraph</Paragraph>
  </>
);
