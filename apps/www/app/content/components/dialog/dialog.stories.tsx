import {
  Button,
  Checkbox,
  Dialog,
  type DialogProps,
  Fieldset,
  Heading,
  Label,
  Paragraph,
  Radio,
  Textarea,
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

export const ModalDialog = () => {
  const _dialogRef = useRef<HTMLDialogElement>(null);
  const [_input, _setInputt] = useState('');

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Åpne modal Dialog</Dialog.Trigger>
      <Dialog>
        <Dialog.Block>
          <Paragraph data-size='sm'>Bekreft endring</Paragraph>
          <Heading>Er du sikker på at du vil endre søknaden? </Heading>
        </Dialog.Block>
        <Dialog.Block>
          <Paragraph>
            OBS! Du bør ikke endre søknaden etter at fristen har gått ut. Hvis
            du endrer søknaden nå, er du ikke lenger med i kommende opptak. Ring
            kontaktsenteret på telefon 00 00 00 00 hvis du trenger veiledning.
          </Paragraph>
        </Dialog.Block>
        <Dialog.Block>
          <div
            style={{
              display: 'flex',
              gap: 'var(--ds-size-4)',
              marginTop: 'var(--ds-size-4)',
            }}
          >
            <Button variant='primary' data-color='danger' data-command='close'>
              Ja, endre
            </Button>
            <Button variant='secondary' data-command='close'>
              Avbryt
            </Button>
          </div>
        </Dialog.Block>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export const ModalDialogEn = () => {
  const _dialogRef = useRef<HTMLDialogElement>(null);
  const [_input, _setInput] = useState('');

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open modal dialog</Dialog.Trigger>
      <Dialog>
        <Dialog.Block>
          <Paragraph data-size='sm'>Confirm change</Paragraph>
          <Heading>Are you sure you want to change the application?</Heading>
        </Dialog.Block>
        <Dialog.Block>
          <Paragraph>
            Note: You should not change the application after the deadline has
            passed. If you change the application now, you will no longer be
            included in the upcoming admission round. Please contact the service
            centre on +00 00 00 00 if you need guidance.
          </Paragraph>
        </Dialog.Block>
        <Dialog.Block>
          <div
            style={{
              display: 'flex',
              gap: 'var(--ds-size-4)',
              marginTop: 'var(--ds-size-4)',
            }}
          >
            <Button variant='primary' data-color='danger' data-command='close'>
              Yes, change
            </Button>
            <Button variant='secondary' data-command='close'>
              Cancel
            </Button>
          </div>
        </Dialog.Block>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export const NonModalDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [_input, setInput] = useState('');

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Åpne ikke-modal Dialog</Dialog.Trigger>
      <Dialog
        ref={dialogRef}
        onClose={() => setInput('')}
        modal={false}
        style={{
          zIndex: '10',
          top: 'calc(100vh - 290px)',
          left: 'calc(100vw - 370px)',
          margin: 0,
          maxWidth: '350px',
        }}
      >
        <Heading style={{ marginBottom: 'var(--ds-size-4)' }}>
          Vi ønsker din mening
        </Heading>
        <Label htmlFor='my-textarea'>Hvordan var din opplevelse?</Label>
        <Textarea
          id='my-textarea'
          style={{
            marginBottom: 'var(--ds-size-6)',
          }}
        />
        <Button>Send inn</Button>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export const NonModalDialogEn = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [_input, setInput] = useState('');

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger>Open non-modal dialog</Dialog.Trigger>
      <Dialog
        ref={dialogRef}
        onClose={() => setInput('')}
        modal={false}
        style={{
          zIndex: '10',
          top: 'calc(100vh - 290px)',
          left: 'calc(100vw - 370px)',
          margin: 0,
          maxWidth: '350px',
        }}
      >
        <Heading style={{ marginBottom: 'var(--ds-size-4)' }}>
          Let us know
        </Heading>
        <Label htmlFor='my-textarea'>How was your experience?</Label>
        <Textarea
          id='my-textarea'
          style={{
            marginBottom: 'var(--ds-size-6)',
          }}
        />
        <Button>Submit</Button>
      </Dialog>
    </Dialog.TriggerContext>
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
          <Button variant='secondary' data-color='danger' data-command='close'>
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
      <Dialog ref={dialogRef} onClose={() => setInput('')} closedby='any'>
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
          <Button variant='secondary' data-color='danger' data-command='close'>
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
