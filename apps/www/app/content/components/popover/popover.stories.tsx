import { Button, Paragraph, Popover } from '@digdir/designsystemet-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

export const Preview = () => {
  return (
    <>
      <Button popovertarget='popover-preview'>Åpne popover</Button>
      <Popover id='popover-preview' placement='top'>
        Popoveret gir en rask beskjed. Her kan du vise brukeren informasjon som
        er relevant for konteksten.
      </Popover>
    </>
  );
};

export const PreviewEn = () => {
  return (
    <>
      <Button popovertarget='popover-preview-en'>Open popover</Button>
      <Popover id='popover-preview-en' placement='top'>
        The popover provides a quick message. You can use it to show the user
        information that is relevant to the context.
      </Popover>
    </>
  );
};

export const Interactive = () => {
  return (
    <>
      <Button
        data-color='danger'
        aria-label='Slett rad'
        popovertarget='popover-interactive'
      >
        <TrashIcon title='Slett rad' />
      </Button>
      <Popover id='popover-interactive' data-color='danger'>
        <Paragraph>
          Er du sikker på at du vil slette raden? Handlingen kan ikke angres.
        </Paragraph>
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-size-2)',
            marginTop: 'var(--ds-size-2)',
          }}
        >
          <Button data-size='sm'>Ja, slett den</Button>
          <Button data-size='sm' variant='tertiary'>
            Avbryt
          </Button>
        </div>
      </Popover>
    </>
  );
};

export const InteractiveEn = () => {
  return (
    <>
      <Button
        data-color='danger'
        aria-label='Delete row'
        popovertarget='popover-interactive-en'
      >
        <TrashIcon title='Delete row' />
      </Button>
      <Popover id='popover-interactive-en' data-color='danger'>
        <Paragraph>
          Are you sure you want to delete this row? This action cannot be
          undone.
        </Paragraph>
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-size-2)',
            marginTop: 'var(--ds-size-2)',
          }}
        >
          <Button data-size='sm'>Yes, delete it</Button>
          <Button data-size='sm' variant='tertiary'>
            Cancel
          </Button>
        </div>
      </Popover>
    </>
  );
};

export const DottedUnderline = () => {
  return (
    <>
      <Paragraph>
        Vi bruker{' '}
        <button
          type='button'
          data-popover='inline'
          popovertarget='popover-dotted-underline'
        >
          design tokens
        </button>{' '}
        for å sikre at vi har en konsistent design.
      </Paragraph>
      <Popover id='popover-dotted-underline' data-color='neutral'>
        <Paragraph>
          <strong
            style={{
              display: 'block',
            }}
          >
            Design tokens
          </strong>
          Design tokens er en samling av variabler som definerer designet i et
          designsystem.
        </Paragraph>
      </Popover>
    </>
  );
};

export const DottedUnderlineEn = () => {
  return (
    <>
      <Paragraph>
        We use{' '}
        <button
          type='button'
          data-popover='inline'
          popovertarget='popover-dotted-underline-en'
        >
          design tokens
        </button>{' '}
        to ensure a consistent design.
      </Paragraph>
      <Popover id='popover-dotted-underline-en' data-color='neutral'>
        <Paragraph>
          <strong
            style={{
              display: 'block',
            }}
          >
            Design tokens
          </strong>
          Design tokens are a collection of variables that define the visual
          style within a design system.
        </Paragraph>
      </Popover>
    </>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button popovertarget='popover-controlled'>Slett</Button>
      <Popover
        id='popover-controlled'
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        data-color='danger'
      >
        <Paragraph>Er du sikker på at du vil slette?</Paragraph>
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-size-2)',
            marginTop: 'var(--ds-size-2)',
          }}
        >
          <Button
            onClick={() => setOpen(false)}
            data-size='sm'
            data-color='danger'
          >
            Slett
          </Button>
          <Button
            data-variant='tertiary'
            onClick={() => setOpen(false)}
            data-size='sm'
          >
            Avbryt
          </Button>
        </div>
      </Popover>
    </>
  );
};

export const ControlledEn = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button popovertarget='popover-controlled-en'>Delete</Button>
      <Popover
        id='popover-controlled-en'
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        data-color='danger'
      >
        <Paragraph>Are you sure you want to delete this?</Paragraph>
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-size-2)',
            marginTop: 'var(--ds-size-2)',
          }}
        >
          <Button
            onClick={() => setOpen(false)}
            data-size='sm'
            data-color='danger'
          >
            Delete
          </Button>
          <Button
            data-variant='tertiary'
            onClick={() => setOpen(false)}
            data-size='sm'
          >
            Cancel
          </Button>
        </div>
      </Popover>
    </>
  );
};
