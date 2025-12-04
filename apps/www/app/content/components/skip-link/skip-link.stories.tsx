import { Paragraph, SkipLink } from '@digdir/designsystemet-react';

export const Preview = () => {
  return (
    <>
      <Paragraph>
        For å vise SkipLink, tab til dette eksempelet, eller klikk inni
        eksempelet og trykk <kbd>Tab</kbd>.
        <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>
      </Paragraph>
      <main id='main-content' tabIndex={-1}>
        Region som kan motta fokus fra skiplink.
      </main>
    </>
  );
};

export const PreviewEn = () => {
  return (
    <>
      <Paragraph>
        To reveal the SkipLink, tab into this example, or click inside the
        example and press <kbd>Tab</kbd>.
        <SkipLink href='#main-content'>Skip to main content</SkipLink>
      </Paragraph>
      <main id='main-content' tabIndex={-1}>
        Region that can receive focus from the skip link.
      </main>
    </>
  );
};
