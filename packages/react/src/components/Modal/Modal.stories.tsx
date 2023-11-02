import React, { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Heading } from '../Typography';
import { Textfield } from '../form/Textfield';

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
        <Modal.Header closeModal={() => modalRef.current?.close()}>
          <Heading
            level={2}
            size='medium'
          >
            Modal header
          </Heading>
        </Modal.Header>
        <Modal.Content>This is my modal!</Modal.Content>
        <Modal.Footer>Modal footer</Modal.Footer>
      </Modal>
    </>
  );
};

Preview.args = {
  closeOnBackdropClick: false,
};

export const CloseOnBackdropClick: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        ref={modalRef}
        closeOnBackdropClick
      >
        <Modal.Header closeModal={() => modalRef.current?.close()}>
          <Heading
            level={2}
            size='medium'
          >
            Modal header
          </Heading>
        </Modal.Header>
        <Modal.Content>This is my modal!</Modal.Content>
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
      <Modal ref={modalRef}>
        <Modal.Header closeModal={() => modalRef.current?.close()}>
          <Heading
            level={2}
            size='medium'
          >
            Modal header
          </Heading>
        </Modal.Header>
        <Modal.Content>
          <Textfield
            label='Navn'
            placeholder='Ola Nordmann'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Modal.Content>
        <Modal.Footer
          style={{
            display: 'flex',
            gap: '.5rem',
          }}
        >
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
