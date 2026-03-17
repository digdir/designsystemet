import { Heading, Paragraph, Skeleton } from '@digdir/designsystemet-react';

export const Preview = () => {
  return <Skeleton width={200} height={100} />;
};

export const Components = () => {
  return (
    <>
      <Skeleton variant='circle' width='50px' height='50px' />
      <Skeleton variant='rectangle' width='100px' height='50px' />
      <Paragraph>
        <Skeleton variant='text' width='10' />
      </Paragraph>
    </>
  );
};

export const UsageExample = () => {
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
};

export const Text = () => {
  return (
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
  );
};

export const TextEn = () => {
  return (
    <>
      <div style={{ flex: '1 1 200px' }}>
        <Heading>A title</Heading>
        <Paragraph data-size='sm'>
          Here is a paragraph that spans multiple lines
        </Paragraph>
      </div>
      <div style={{ flex: '1 1 200px' }}>
        <Heading>
          <Skeleton variant='text'>A title</Skeleton>
        </Heading>
        <Paragraph data-size='sm'>
          <Skeleton variant='text' width={40} />
        </Paragraph>
      </div>
    </>
  );
};
