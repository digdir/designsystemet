import type { Meta, StoryFn } from '@storybook/react';
import { useRef, useState } from 'react';

import { Button, Combobox, Divider, Paragraph, Textfield } from '..';

import { Modal } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '2rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Komponenter/Modal',
  component: Modal.Dialog,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof Modal.Dialog> = (args) => {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal.Dialog {...args}>
          <Modal.Header>Modal header</Modal.Header>
          <Modal.Content>
            <Paragraph>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Blanditiis doloremque obcaecati assumenda odio ducimus sunt et.
            </Paragraph>
          </Modal.Content>
          <Modal.Footer>Modal footer</Modal.Footer>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};

export const WithoutTriggerComponent: StoryFn<typeof Modal.Dialog> = (args) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal.Root>
        <Modal.Dialog {...args} ref={modalRef}>
          <Modal.Header subtitle='Modal subtittel'>Modal header</Modal.Header>
          <Modal.Content>
            <Paragraph>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Blanditiis doloremque obcaecati assumenda odio ducimus sunt et.
            </Paragraph>
          </Modal.Content>
          <Modal.Footer>Modal footer</Modal.Footer>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};

export const CloseOnBackdropClick: StoryFn<typeof Modal.Dialog> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <Modal.Root>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        onInteractOutside={() => modalRef.current?.close()}
      >
        <Modal.Header>
          Modal med closeOnBackdropClick og en veldig lang tittel
        </Modal.Header>
        <Modal.Content>
          <Paragraph>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
            doloremque obcaecati assumenda odio ducimus sunt et.
          </Paragraph>
        </Modal.Content>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal.Dialog>
    </Modal.Root>
  );
};

export const WithDivider: StoryFn<typeof Modal.Dialog> = () => {
  return (
    <Modal.Root>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal.Dialog>
        <Modal.Header subtitle='Her er det også divider'>
          Vi kan legge divider under header
        </Modal.Header>
        <Divider color='subtle' />
        <Modal.Content>
          <Paragraph>Rundt content</Paragraph>
        </Modal.Content>
        <Divider color='subtle' />
        <Modal.Footer>Og over footer</Modal.Footer>
      </Modal.Dialog>
    </Modal.Root>
  );
};

export const ModalWithForm: StoryFn<typeof Modal.Dialog> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState('');

  return (
    <Modal.Root>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal.Dialog ref={modalRef} onClose={() => setInput('')}>
        <Modal.Header>Modal med skjema</Modal.Header>
        <Modal.Content>
          <Textfield
            label='Navn'
            placeholder='Ola Nordmann'
            value={input}
            autoFocus
            onChange={(e) => setInput(e.target.value)}
          />
        </Modal.Content>
        <Modal.Footer>
          <Button
            onClick={() => {
              window.alert(`Du har sendt inn skjema med navn: ${input}`);
              modalRef.current?.close();
            }}
          >
            Send inn skjema
          </Button>
          <Button variant='secondary' onClick={() => modalRef.current?.close()}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal.Root>
  );
};

export const ModalWithMaxWidth: StoryFn<typeof Modal.Dialog> = () => {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        {/* @ts-expect-error #2353 */}
        <Modal.Dialog style={{ '--dsc-modal-max-width': '1200px' }}>
          <Modal.Header>Modal med en veldig lang bredde</Modal.Header>
          <Modal.Content>
            <Paragraph>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Blanditiis doloremque obcaecati assumenda odio ducimus sunt et.
            </Paragraph>
          </Modal.Content>
          <Modal.Footer>Footer</Modal.Footer>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};

export const ModalWithSelect: StoryFn<typeof Modal.Dialog> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal.Dialog style={{ overflow: 'visible' }}>
          <Modal.Header>Modal med select</Modal.Header>
          <Modal.Content>
            <Combobox portal={false} label='Velg sted'>
              <Combobox.Empty>Fant ingen treff</Combobox.Empty>
              <Combobox.Option value='leikanger'>Leikanger</Combobox.Option>
              <Combobox.Option value='oslo'>Oslo</Combobox.Option>
              <Combobox.Option value='bronnoysund'>Brønnøysund</Combobox.Option>
              <Combobox.Option value='stavanger'>Stavanger</Combobox.Option>
              <Combobox.Option value='trondheim'>Trondheim</Combobox.Option>
              <Combobox.Option value='tromso'>Tromsø</Combobox.Option>
              <Combobox.Option value='bergen'>Bergen</Combobox.Option>
              <Combobox.Option value='moirana'>Mo i Rana</Combobox.Option>
            </Combobox>
          </Modal.Content>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => modalRef.current?.close()}
            >
              Avbryt
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};
