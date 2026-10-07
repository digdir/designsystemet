import { Button, Card, Heading, Paragraph } from '@digdir/designsystemet-react';

// The landing view: choose between importing a config into this file and exporting this file's config.
export function HomeView({
  onImport,
  onExport,
}: {
  onImport: () => void;
  onExport: () => void;
}): React.JSX.Element {
  return (
    <div className='home-view'>
      <Card data-color='neutral'>
        <Heading level={2} data-size='sm'>
          Import to Figma
        </Heading>
        <Paragraph>
          Paste a config file from the theme builder to create or update the
          variables and styles in this file.
        </Paragraph>
        <Button onClick={onImport}>Import</Button>
      </Card>
      <Card data-color='neutral'>
        <Heading level={2} data-size='sm'>
          Export from Figma
        </Heading>
        <Paragraph>
          Create a config file from the variables and styles in this file, to
          keep in your code or import into another file.
        </Paragraph>
        <Button onClick={onExport} variant='secondary'>
          Export
        </Button>
      </Card>
    </div>
  );
}
