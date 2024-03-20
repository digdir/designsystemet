import * as React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { PlusCircleIcon } from '@navikt/aksel-icons';

import { Button } from '../../Button';
import { Paragraph } from '../../Typography';
import { Switch } from '../Switch';
import { Modal } from '../../Modal';
import { ChipRemovable } from '../../Chip';

import { data } from './data/data';
import ComboboxCustom from './Custom/Custom';

import { Combobox } from './index';

export default {
  title: 'Komponenter/Combobox',
  component: Combobox,
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: '30rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
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
      <Combobox {...args}>
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
  hideClearButton: false,
  virtual: false,
  description: 'Velg et sted',
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const Multiple: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <>
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
      <Paragraph>Value er: {value.join(', ')}</Paragraph>
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

export const WithChipsOutside: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <>
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--fds-spacing-2)',
        }}
      >
        {value.map((item, index) => (
          <ChipRemovable
            key={index}
            onClick={() => {
              setValue(value.filter((v) => v !== item));
            }}
          >
            {item}
          </ChipRemovable>
        ))}
      </div>

      <Combobox
        {...args}
        value={value}
        multiple={true}
        onValueChange={(value) => {
          setValue(value);
        }}
        label='Hvor går reisen?'
        hideChips={true}
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
      <Paragraph>Value er: {value.join(', ')}</Paragraph>
    </>
  );
};

export const SelectAll: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>(['all']);

  const handleValueChange = (newVal: string[]) => {
    setValue(newVal);

    // if we have all, and we select something else, remove all
    if (newVal.includes('all') && newVal.length > 1) {
      setValue(newVal.filter((v) => v !== 'all'));
    }

    // if we click all, deselect all other options
    if (newVal.includes('all') && !value.includes('all')) {
      setValue(['all']);
    }
  };

  return (
    <>
      <Combobox
        {...args}
        value={value}
        multiple={true}
        onValueChange={handleValueChange}
        label='Hvor går reisen?'
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        <Combobox.Option value={'all'}>Alle kommuner</Combobox.Option>
        {PLACES.map((item, index) => (
          <Combobox.Option
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Option>
        ))}
      </Combobox>
      <Paragraph>Value er: {value.join(', ')}</Paragraph>
    </>
  );
};

export const Virtualized: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <Combobox
      {...args}
      value={value}
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
  );
};

Virtualized.args = {
  multiple: false,
  virtual: true,
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const Loading: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = React.useState<string[]>([]);
  const [options, setOptions] = React.useState<typeof PLACES>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchOptions = () => {
    if (!loading) return;
    setTimeout(() => {
      setOptions(PLACES);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <Button
        onClick={() => {
          setLoading(true);
          setOptions([]);
          setValue([]);
        }}
        style={{
          marginBottom: '1rem',
        }}
      >
        Clear Data
      </Button>
      <Combobox
        {...args}
        value={value}
        onValueChange={(value) => {
          setValue(value);
        }}
        onFocus={fetchOptions}
        loading={loading}
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {options.map((item, index) => (
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

Loading.args = {
  multiple: false,
  size: 'medium',
  label: 'Hvor går reisen?',
};

export const CustomNewValue: StoryFn<typeof Combobox> = (args) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [value, setValue] = React.useState<string[]>([]);
  const [options, setOptions] = React.useState(PLACES);

  const onNewValueAdd = () => {
    if (!showAddNew) return;

    setOptions([
      ...options,
      {
        name: inputValue,
        value: inputValue.toLowerCase(),
        description: '',
      },
    ]);
    setValue([...value, inputValue.toLowerCase()]);
  };

  const showAddNew =
    inputValue &&
    !options.some((option) => option.value === inputValue.toLowerCase());

  return (
    <>
      <style>
        {`
        [data-active='true'] {
          background-color: var(--fds-semantic-surface-action-first-no_fill-hover);
        }
      `}
      </style>
      <Combobox
        {...args}
        value={value}
        onValueChange={(value) => {
          setValue(value);
          setInputValue('');
        }}
        inputValue={inputValue}
        multiple={true}
        placeholder='Skriv for å legge inn ny'
        onChange={(e) => setInputValue(e.target.value)}
      >
        {showAddNew && (
          <ComboboxCustom
            style={{
              display: 'flex',
              gap: 'var(--fds-spacing-2)',
              alignContent: 'center',
            }}
            asChild
            interactive
            id='custom-option'
            onSelect={onNewValueAdd}
          >
            <Button
              variant='secondary'
              onClick={onNewValueAdd}
              style={{
                width: '100%',
              }}
            >
              <PlusCircleIcon
                title='plus'
                fontSize='1.5rem'
              />
              Legg til &quot;{inputValue}&quot;
            </Button>
          </ComboboxCustom>
        )}
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {options.map((item, index) => (
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

CustomNewValue.args = {
  multiple: false,
  size: 'medium',
  label: 'Hvor går reisen?',
};
