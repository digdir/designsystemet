import {
  Button,
  Dialog,
  Heading,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import { useRef, useState } from 'react';

export const Preview = () => {
  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog>
        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
          Dialog header
        </Heading>
        <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
          doloremque obcaecati assumenda odio ducimus sunt et.
        </Paragraph>
        <Paragraph data-size='sm'>Dialog footer</Paragraph>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export const WithRef = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => dialogRef.current?.showModal()}>
        Open Dialog with ref
      </Button>
      <Dialog ref={dialogRef}>
        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
          Dialog header
        </Heading>
        <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
          doloremque obcaecati assumenda odio ducimus sunt et.
        </Paragraph>
      </Dialog>
    </>
  );
};

export const WithForm = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState('');

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog ref={dialogRef} onClose={() => setInput('')} closedby='any'>
        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
          Dialog med skjema
        </Heading>
        <Textfield
          label='Navn'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // @ts-expect-error We want the native "autofocus" and Reacts onMount smartness (see https://react.dev/reference/react-dom/components/input#input)
          autofocus='true'
        />
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-size-4)',
            marginTop: 'var(--ds-size-4)',
          }}
        >
          <Button
            onClick={() => {
              window.alert(`Du har sendt inn skjema med navn: ${input}`);
              dialogRef.current?.close();
            }}
          >
            Send inn skjema
          </Button>
          <Button variant='secondary' data-command='close'>
            Avbryt
          </Button>
        </div>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export const WithBlocks = () => {
  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog>
        <Dialog.Block>
          <Paragraph data-size='sm'>Dialog subtitle</Paragraph>
          <Heading>Dialog with dividers</Heading>
        </Dialog.Block>
        <Dialog.Block>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            sodales eros justo.
          </Paragraph>
        </Dialog.Block>
        <Dialog.Block>
          <Button variant='secondary' data-command='close'>
            Lukk
          </Button>
        </Dialog.Block>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export const CloseWithClickOutside = () => {
  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog closedby='any'>
        <Heading>Click outside to close</Heading>
      </Dialog>
    </Dialog.TriggerContext>
  );
};
;
