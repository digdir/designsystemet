import React, { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Textfield } from '../form/Textfield';
import { Paragraph } from '../Typography';
import { Divider } from '../Divider';

import { Modal } from '.';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '2rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Felles/Modal',
  component: Modal,
  decorators,
} as Meta;

export const Preview: StoryFn<typeof Modal> = (args) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        {...args}
        ref={modalRef}
      >
        <Modal.Header
          title='Modal header'
          subtitle='Modal subtittel'
        ></Modal.Header>
        <Modal.Content>
          <Paragraph>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
            doloremque obcaecati assumenda odio ducimus sunt et.
          </Paragraph>
        </Modal.Content>
        <Modal.Footer>Modal footer</Modal.Footer>
      </Modal>
    </>
  );
};

Preview.args = {
  width: '650px',
};

export const CloseOnBackdropClick: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        ref={modalRef}
        onInteractOutside={() => modalRef.current?.close()}
      >
        <Modal.Header
          title='Modal med closeOnBackdropClick og en veldig lang tittel'
          subtitle='Her er det også divider'
        ></Modal.Header>
        <Divider />
        <Modal.Content>
          <Paragraph>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
            doloremque obcaecati assumenda odio ducimus sunt et.
          </Paragraph>
        </Modal.Content>
        <Divider />
        <Modal.Footer>Du kan også ha divider på footer</Modal.Footer>
      </Modal>
    </>
  );
};

export const ModalWithForm: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState('');

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        ref={modalRef}
        onClose={() => setInput('')}
        width='450px'
      >
        <Modal.Header title='Modal med skjema'></Modal.Header>
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
          <Button
            variant='secondary'
            onClick={() => modalRef.current?.close()}
          >
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
