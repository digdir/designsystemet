import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '../../Button';
import { Paragraph } from '../../Typography';
import { Switch } from '../Switch';
import { Modal } from '../../Modal';

import { data } from './data/data';

import { EXPERIMENTAL_Combobox as Combobox } from './index';

export default {
  title: 'Experimental/Combobox',
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
  {
    name: 'Mo i Rana',
    value: 'moirana',
    description: 'Nordland',
  },
];

export const Preview: StoryFn<typeof Combobox> = (args) => {
  return (
    <>
      <Combobox
        {...args}
        onValueChange={(e) => console.log(e)}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
          <Combobox.Option
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Option>
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
  hideChips: false,
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
          <Combobox.Option
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Option>
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
        key={multiple ? 'multiple' : 'single'}
        {...args}
        value={value}
        multiple={multiple}
        onValueChange={(value) => {
          setValue(value);
        }}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {data.map((item, index) => (
          <Combobox.Option
            key={index}
            value={item.targetName}
            description={`Orgnr.: ${item.sourceCode}`}
          >
            {item.targetName}
          </Combobox.Option>
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
          <Combobox.Option
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Option>
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
            <Combobox.Option
              key={index}
              value={item.value}
            >
              {item.name}
            </Combobox.Option>
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
      <Modal
        ref={modalRef}
        style={{
          overflow: 'visible',
        }}
      >
        <Modal.Header>Combobox i Modal</Modal.Header>
        <Modal.Content>
          <Combobox
            {...args}
            value={value}
            multiple={true}
            onValueChange={(value) => {
              setValue(value);
            }}
            label='Hvor går reisen?'
            portal={false}
          >
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            {PLACES.map((item, index) => (
              <Combobox.Option
                key={index}
                value={item.value}
              >
                {item.name}
              </Combobox.Option>
            ))}
          </Combobox>
        </Modal.Content>
      </Modal>
    </>
  );
};
