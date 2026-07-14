import preview from '../../../../../apps/storybook/.storybook/preview';
import { Button, Heading, Paragraph } from '../';
import { Skeleton } from './skeleton';

const meta = preview.meta({
  title: 'Komponenter/Skeleton',
  component: Skeleton,
  parameters: {
    a11y: {
      config: {
        // Disable a11y empty heading rule as we intentionally set aria-hidden="true" on the Skeleton component inside Headings
        rules: [{ id: 'empty-heading', selector: ':has(.ds-skeleton)' }],
      },
    },
  },
});

export const Preview = meta.story({
  args: {
    width: 200,
    height: 100,
  },
});

export const Components = meta.story({
  render: () => {
    return (
      <>
        <Skeleton variant='circle' width='50px' height='50px' />
        <Skeleton variant='rectangle' width='100px' height='50px' />
        <Paragraph>
          <Skeleton variant='text' width='10' />
        </Paragraph>
      </>
    );
  },

  parameters: {
    customStyles: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '20px',
    },
  },
});

export const UsageExample = meta.story({
  render: () => {
    return (
      <>
        <Skeleton height='150px' />
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            padding: '5px 0 5px 0',
          }}
        >
          <Skeleton variant='circle' width='30px' height='30px' />
          <Heading>
            <Skeleton variant='text'>En medium tittel</Skeleton>
          </Heading>
        </div>
        <Skeleton variant='text' width='140' />
      </>
    );
  },

  parameters: {
    customStyles: {
      maxWidth: 400,
    },
  },
});

export const Children = meta.story(() => {
  return (
    <Skeleton variant='rectangle'>
      <Paragraph>
        Her er en tekst som blir sendt inn som barn av en Skeleton.
      </Paragraph>
      <Paragraph>
        Se hvordan Skeleton da dekker den samlede bredden og høyden til barna.
      </Paragraph>
      <Button>Knapp</Button>
    </Skeleton>
  );
});

export const Text = meta.story({
  render: () => (
    <>
      <div style={{ flex: '1 1 200px' }}>
        <Heading>En tittel</Heading>
        <Paragraph data-size='sm'>
          Her er en paragraf som går over flere linjer
        </Paragraph>
      </div>
      <div style={{ flex: '1 1 200px' }}>
        <Heading>
          <Skeleton variant='text'>En tittel</Skeleton>
        </Heading>
        <Paragraph data-size='sm'>
          <Skeleton variant='text' width={40} />
        </Paragraph>
      </div>
    </>
  ),

  parameters: {
    customStyles: { display: 'flex', gap: '20px', maxWidth: 300 },
  },
});
