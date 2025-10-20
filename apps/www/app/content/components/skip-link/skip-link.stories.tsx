import { Paragraph, SkipLink } from '@digdir/designsystemet-react';

export const Preview = () => (
  <>
    <Paragraph>
      For å vise skiplinken, tab til dette eksempelet, eller klikk inni
      eksempelet og trykk <kbd>Tab</kbd>.
      <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>
    </Paragraph>
    <main id='main-content' tabIndex={-1}>
      Region som kan motta fokus fra skiplink.
    </main>
  </>
);
