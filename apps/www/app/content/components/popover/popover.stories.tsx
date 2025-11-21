import { Button, Paragraph, Popover } from '@digdir/designsystemet-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

export const Preview = () => {
  return (
    <Popover.TriggerContext>
      <Popover.Trigger>Mine varsler</Popover.Trigger>
      <Popover placement='top'>Du har ingen varsler</Popover>
    </Popover.TriggerContext>
  );
};

export const Interactive = () => {
  return (
    <Popover.TriggerContext>
      <Popover.Trigger data-color='danger' aria-label='Slett rad'>
        <TrashIcon title='Slett rad' />
      </Popover.Trigger>
      <Popover data-color='danger'>
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
    </Popover.TriggerContext>
  );
};

export const DottedUnderline = () => {
  return (
    <Popover.TriggerContext>
      <Paragraph>
        Vi bruker <Popover.Trigger inline>design tokens</Popover.Trigger> for å
        sikre at vi har en konsistent design.
      </Paragraph>
      <Popover data-color='neutral'>
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
    </Popover.TriggerContext>
  );
};

export const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.TriggerContext>
      <Popover.Trigger onClick={() => setOpen(!open)}>Slett</Popover.Trigger>
      <Popover open={open} onClose={() => setOpen(false)} data-color='danger'>
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
    </Popover.TriggerContext>
  );
};

export const WithoutContext = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        data-color='danger'
        popovertarget='my-popover'
        onClick={() => setOpen(!open)}
      >
        Slett
      </Button>
      <Popover
        id='my-popover'
        open={open}
        onClose={() => setOpen(false)}
        data-color='danger'
      >
        <Paragraph>Er du sikker på at du vil slette?</Paragraph>
        <Button
          onClick={() => setOpen(false)}
          data-size='sm'
          style={{ marginTop: 'var(--ds-size-2)' }}
        >
          Slett
        </Button>
      </Popover>
    </>
  );
};
