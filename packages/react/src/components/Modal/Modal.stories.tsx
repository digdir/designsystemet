import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';

import { Modal } from './index';

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '10rem' }}>
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
  const modalRef = React.useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        {...args}
        ref={modalRef}
      >
        <Modal.Header closeModal={() => modalRef.current?.close()}>
          Modal header
        </Modal.Header>
        This is my modal!
      </Modal>
    </>
  );
};
