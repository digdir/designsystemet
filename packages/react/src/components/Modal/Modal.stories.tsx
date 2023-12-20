import React, { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Textfield } from '../form/Textfield';
import { Paragraph } from '../Typography';
import { Divider } from '../Divider';
import { LegacySelect } from '../legacy/LegacySelect/';

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
        <Modal.Header subtitle='Modal subtittel'>Modal header</Modal.Header>
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

export const CloseOnBackdropClick: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
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
      </Modal>
    </>
  );
};

export const WithDivider: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal ref={modalRef}>
        <Modal.Header subtitle='Her er det også divider'>
          Vi kan legge divider under header
        </Modal.Header>
        <Divider color='subtle' />
        <Modal.Content>
          <Paragraph>Rundt content</Paragraph>
        </Modal.Content>
        <Divider color='subtle' />
        <Modal.Footer>Og over footer</Modal.Footer>
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
      >
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

export const ModalWithMaxWidth: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState('');

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        ref={modalRef}
        onClose={() => setInput('')}
        style={{ maxWidth: '1200px' }}
      >
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

export const defaultArgs = {
  label: 'Velg et fylke',
  multiple: false,
  options: [
    {
      label: 'Agder',
      value: 'Agd',
      keywords: ['agder', 'aust-agder', 'vest-agder'],
    },
    {
      label: 'Innlandet',
      value: 'Inn',
      keywords: ['innlandet', 'hedmark', 'oppland'],
    },
    {
      label: 'Møre og Romsdal',
      value: 'MoR',
      keywords: ['møre og romsdal', 'møre', 'romsdal'],
    },
    { label: 'Nordland', value: 'Nor', keywords: ['nordland'] },
    { label: 'Oslo', value: 'Osl', keywords: ['oslo'] },
    { label: 'Rogaland', value: 'Rog', keywords: ['rogaland'] },
    {
      label: 'Vestfold og Telemark',
      value: 'VoT',
      keywords: ['vestfold og telemark', 'vestfold', 'telemark'],
    },
    {
      label: 'Troms og Finnmark',
      value: 'ToF',
      keywords: ['troms og finnmark', 'troms', 'finnmark'],
    },
    {
      label: 'Trøndelag',
      value: 'Trø',
      keywords: ['trøndelag', 'nord-trøndelag', 'sør-trøndelag'],
    },
    {
      label: 'Vestland',
      value: 'Ves',
      keywords: ['vestland', 'hordaland', 'sogn og fjordane'],
    },
    {
      label: 'Viken',
      value: 'Vik',
      keywords: ['viken', 'østfold', 'akershus', 'buskerud'],
    },
  ],
};

export const ModalWithSelect: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal
        ref={modalRef}
        style={{ overflow: 'visible' }}
      >
        <Modal.Header>Modal med select</Modal.Header>
        <Modal.Content>
          <LegacySelect
            portal={false}
            {...{ ...defaultArgs }}
          ></LegacySelect>
        </Modal.Content>
        <Modal.Footer>
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
