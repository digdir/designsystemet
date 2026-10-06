import { Button, Card, Heading, Paragraph } from '@digdir/designsystemet-react';

// The landing view: choose between syncing a config to this file and extracting this file's config.
export function HomeView({
  onSync,
  onExtract,
}: {
  onSync: () => void;
  onExtract: () => void;
}): React.JSX.Element {
  return (
    <div className='home-view'>
      <Card data-color='neutral'>
        <Heading level={2} data-size='sm'>
          Sync config to Figma
        </Heading>
        <Paragraph>
          Paste a config from the theme builder to create or update the
          variables and styles in this file.
        </Paragraph>
        <Button onClick={onSync}>Sync config</Button>
      </Card>
      <Card data-color='neutral'>
        <Heading level={2} data-size='sm'>
          Extract config from Figma
        </Heading>
        <Paragraph>
          Create a config from the variables and styles in this file, to keep in
          your code or sync to another file.
        </Paragraph>
        <Button onClick={onExtract} variant='secondary'>
          Extract config
        </Button>
      </Card>
    </div>
  );
}
