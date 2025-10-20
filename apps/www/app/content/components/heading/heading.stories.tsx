import { Heading } from '@digdir/designsystemet-react';

export const Preview = () => <Heading>Tittel tekst</Heading>;

export const Sizes = () => (
  <>
    <Heading data-size='2xl' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a 2xl heading
    </Heading>
    <Heading data-size='xl' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is an xl heading
    </Heading>
    <Heading data-size='lg' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a lg heading
    </Heading>
    <Heading data-size='md' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a md heading
    </Heading>
    <Heading data-size='sm' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a sm heading
    </Heading>
    <Heading data-size='xs' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is an xs heading
    </Heading>
    <Heading data-size='2xs' style={{ marginBottom: 'var(--ds-size-4)' }}>
      This is a 2xs heading
    </Heading>
  </>
);
