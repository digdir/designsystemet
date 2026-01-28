import {
  Button,
  Checkbox,
  Dialog,
  type DialogProps,
  Fieldset,
  Heading,
  Paragraph,
  Radio,
  Textfield,
} from '@digdir/designsystemet-react';
import { type ChangeEvent, useRef, useState } from 'react';

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
      <Dialog
        ref={dialogRef}
        onClose={() => setInput('')}
        closedby='any'
        id='my-dialog-form'
      >
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
          <Button
            variant='secondary'
            data-color='danger'
            command='close'
            commandfor='my-dialog-form'
          >
            Avbryt
          </Button>
        </div>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export const WithFormEn = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState('');

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog
        ref={dialogRef}
        onClose={() => setInput('')}
        closedby='any'
        id='my-dialog-form-en'
      >
        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
          Dialog with form
        </Heading>
        <Textfield
          label='Name'
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
              window.alert(`You submitted the form with the name: ${input}`);
              dialogRef.current?.close();
            }}
          >
            Submit form
          </Button>
          <Button
            variant='secondary'
            data-color='danger'
            command='close'
            commandfor='my-dialog-form-en'
          >
            Cancel
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
      <Dialog id='my-dialog-blocks'>
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
          <Button
            variant='secondary'
            command='close'
            commandfor='my-dialog-blocks'
          >
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

export const Drawer = () => {
  const [placement, setPlacement] =
    useState<DialogProps['placement']>('bottom');
  const [modal, setModal] = useState(true);
  return (
    <>
      <Checkbox
        label='Modal'
        checked={modal}
        style={{ marginBottom: 'var(--ds-size-4)' }}
        onChange={(e) => setModal(e.target.checked)}
      />
      <Fieldset
        onChange={(e: ChangeEvent<HTMLFieldSetElement>) => {
          const target = e.target as unknown as HTMLInputElement;
          setPlacement(target.value as DialogProps['placement']);
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--ds-size-5)',
            marginBottom: 'var(--ds-size-8)',
          }}
        >
          <Radio name='drawer' label='Center' value='center' />
          <Radio name='drawer' label='Top' value='top' />
          <Radio name='drawer' label='Bottom' value='bottom' />
          <Radio name='drawer' label='Left' value='left' />
          <Radio name='drawer' label='Right' value='right' />
        </div>
      </Fieldset>
      <Dialog.TriggerContext>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog
          modal={modal}
          closedby='any'
          placement={placement}
          style={{ zIndex: '10' }}
        >
          <Dialog.Block>
            <Paragraph>
              This is a {modal ? 'modal' : 'non-modal'} Dialog with{' '}
              <code>placement="{placement}"</code>
            </Paragraph>
          </Dialog.Block>
        </Dialog>
      </Dialog.TriggerContext>
    </>
  );
};
