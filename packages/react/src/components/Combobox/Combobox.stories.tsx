import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../Button';
import { Paragraph } from '../Typography';
import { Switch } from '../form/Switch';

import { Combobox } from './index';
import { Modal } from '../Modal';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

const PLACES = [
  {
    name: 'Leikanger',
    value: 'leikanger',
    description: 'Vestland',
  },
  {
    name: 'Oslo',
    value: 'oslo',
    description: 'Oslo',
  },
  {
    name: 'Brønnøysund',
    value: 'bronnoysund',
    description: 'Nordland',
  },
  {
    name: 'Stavanger',
    value: 'stavanger',
    description: 'Rogaland',
  },
  {
    name: 'Trondheim',
    value: 'trondheim',
    description: 'Trøndelag',
  },
  {
    name: 'Tromsø',
    value: 'tromso',
    description: 'Troms og Finnmark',
  },
  {
    name: 'Bergen',
    value: 'bergen',
    description: 'Vestland',
  },
];

export const Preview: StoryFn<typeof Combobox> = (args) => {
  return (
    <>
      <Combobox {...args}>
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

Preview.args = {
  multiple: false,
  readOnly: false,
  disabled: false,
  hideLabel: false,
  description: 'Velg et sted',
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const Multiple: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <>
      <Paragraph>Value er: {value.join(', ')}</Paragraph>
      <Combobox
        {...args}
        value={value}
        onValueChange={(value) => {
          setValue(value);
        }}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

Multiple.args = {
  multiple: true,
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const WithDescription: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);
  const [multiple, setMultiple] = React.useState<boolean>(false);

  return (
    <>
      <Switch
        checked={multiple}
        onChange={(e) => {
          setMultiple(e.target.checked);
          setValue([]);
        }}
      >
        Multiple
      </Switch>
      <Combobox
        {...args}
        value={value}
        multiple={multiple}
        onValueChange={(value) => {
          setValue(value);
        }}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
            description={item.description}
          >
            {item.name}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

WithDescription.args = {
  multiple: false,
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const Controlled: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);
  const [multiple, setMultiple] = React.useState<boolean>(false);

  return (
    <>
      <Switch
        checked={multiple}
        onChange={(e) => {
          setMultiple(e.target.checked);
          setValue([]);
        }}
      >
        Multiple
      </Switch>
      <Button
        onClick={() => {
          setValue(['leikanger']);
        }}
        style={{ marginBottom: '1rem' }}
      >
        Sett verdi til Leikanger
      </Button>
      Value er: {value.join(', ')}
      <Combobox
        {...args}
        key={multiple ? 'multiple' : 'single'}
        value={value}
        multiple={multiple}
        onValueChange={(value) => {
          setValue(value);
        }}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

export const InForm: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Array.from(formData.values());
    alert(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Combobox
          {...args}
          value={value}
          multiple={true}
          onValueChange={(value) => {
            setValue(value);
          }}
          name='sted'
        >
          <Combobox.Empty>Fant ingen treff</Combobox.Empty>
          {PLACES.map((item, index) => (
            <Combobox.Item
              key={index}
              value={item.value}
            >
              {item.name}
            </Combobox.Item>
          ))}
        </Combobox>

        <Button
          style={{
            marginTop: '1rem',
          }}
          type='submit'
        >
          Send!
        </Button>
      </form>
    </>
  );
};

InForm.args = {
  multiple: true,
  label: 'Hvor går reisen?',
};

export const InModal: StoryFn<typeof Combobox> = (args) => {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <>
      <Button
        onClick={() => {
          modalRef.current?.showModal();
        }}
      >
        Open Modal
      </Button>
      <Modal ref={modalRef}>
        <Modal.Header>Combobox i Modal</Modal.Header>
        <Modal.Content
          style={{
            padding: '1rem 1rem 20rem 1rem',
          }}
        >
          <Combobox
            {...args}
            value={value}
            multiple={true}
            onValueChange={(value) => {
              setValue(value);
            }}
            label='Hvor går reisen?'
          >
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            {PLACES.map((item, index) => (
              <Combobox.Item
                key={index}
                value={item.value}
              >
                {item.name}
              </Combobox.Item>
            ))}
          </Combobox>
        </Modal.Content>
      </Modal>
    </>
  );
};
