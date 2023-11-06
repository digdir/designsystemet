import React, { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Textfield } from '../form/Textfield';
import { Paragraph } from '../Typography';

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
  closeOnBackdropClick: false,
  headerTitle: 'Modal tittel',
  headerSubtitle: 'Modal undertittel',
  headerDivider: false,
  closeButton: true,
};

export const CloseOnBackdropClick: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        ref={modalRef}
        closeOnBackdropClick
        headerTitle='Modal med closeOnBackdropClick og en veldig lang tittel'
      >
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

export const ModalWithForm: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState('');

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        ref={modalRef}
        onClose={() => setInput('')}
        headerTitle='Modal med skjema'
      >
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
            variant='secondary'
            onClick={() => modalRef.current?.close()}
          >
            Avbryt
          </Button>
          <Button
            onClick={() => {
              window.alert(`Du har sendt inn skjema med navn: ${input}`);
              modalRef.current?.close();
            }}
          >
            Send inn skjema
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
