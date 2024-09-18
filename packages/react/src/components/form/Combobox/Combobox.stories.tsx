import type { Meta, StoryFn } from '@storybook/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '../../Button';
import { ChipRemovable } from '../../Chip';
import { Modal } from '../../Modal';
import { Paragraph } from '../../Typography';
import { Switch } from '../Switch';

import { data } from './data/data';

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
          <Combobox.Option key={index} value={item.value}>
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
  size: 'md',
  label: 'Hvor går reisen?',
};

export const Multiple: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>([]);

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
          <Combobox.Option key={index} value={item.value}>
            {item.name}
          </Combobox.Option>
        ))}
      </Combobox>
    </>
  );
};

Multiple.args = {
  multiple: true,
  size: 'md',
  label: 'Hvor går reisen?',
};

export const WithDescription: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>([]);
  const [multiple, setMultiple] = useState<boolean>(false);

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
  size: 'md',
  label: 'Hvor går reisen?',
};

export const Controlled: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>([]);
  const [multiple, setMultiple] = useState<boolean>(false);

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
        <Combobox.Empty key='empty'>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item) => (
          <Combobox.Option key={item.value} value={item.value}>
            {item.name}
          </Combobox.Option>
        ))}
      </Combobox>
    </>
  );
};

export const InForm: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
            <Combobox.Option key={index} value={item.value}>
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
  const modalRef = useRef<HTMLDialogElement>(null);
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <Button
        onClick={() => {
          modalRef.current?.showModal();
        }}
      >
        Open Modal
      </Button>
      <Modal.Context>
        <Modal
          ref={modalRef}
          style={{
            overflow: 'visible',
          }}
        >
          <Modal.Header>Combobox i Modal</Modal.Header>

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
              <Combobox.Option key={index} value={item.value}>
                {item.name}
              </Combobox.Option>
            ))}
          </Combobox>
        </Modal>
      </Modal.Context>
    </>
  );
};

export const WithChipsOutside: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--ds-spacing-2)',
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
          <Combobox.Option key={index} value={item.value}>
            {item.name}
          </Combobox.Option>
        ))}
      </Combobox>
      <Paragraph>Value er: {value.join(', ')}</Paragraph>
    </>
  );
};

export const SelectAll: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>(['all']);

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
        initialValue={['all']}
        multiple={true}
        onValueChange={handleValueChange}
        label='Hvor går reisen?'
      >
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        <Combobox.Option value={'all'}>Alle kommuner</Combobox.Option>
        {PLACES.map((item, index) => (
          <Combobox.Option key={index} value={item.value}>
            {item.name}
          </Combobox.Option>
        ))}
      </Combobox>
      <Paragraph>Value er: {value.join(', ')}</Paragraph>
    </>
  );
};

export const Virtualized: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>([]);

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
  size: 'md',
  label: 'Hvor går reisen?',
};

export const Loading: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState<string[]>([]);
  const [options, setOptions] = useState<typeof PLACES>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
          <Combobox.Option key={index} value={item.value}>
            {item.name}
          </Combobox.Option>
        ))}
      </Combobox>
    </>
  );
};

Loading.args = {
  multiple: false,
  size: 'md',
  label: 'Hvor går reisen?',
};

const items = Array.from({ length: 2000 }, (_, index) => ({
  name: `Option ${index}`,
  value: `option-${index}`,
}));

export const ThousandsOfOptions: StoryFn<typeof Combobox> = (args) => {
  return (
    <Combobox {...args}>
      <Combobox.Empty>Fant ingen treff</Combobox.Empty>
      {items.map((item, index) => (
        <Combobox.Option key={index} value={item.value}>
          {item.name}
        </Combobox.Option>
      ))}
    </Combobox>
  );
};

ThousandsOfOptions.args = {
  virtual: true,
};

export const RemoveAllOptions: StoryFn<typeof Combobox> = (args) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([
    'test1',
    'test2',
  ]);
  const [values, setValues] = useState<string[]>(['test1', 'test2']);

  const handleComboboxChange = (values: string[]) => {
    setSelectedValues(values);
  };

  const changeAllValues = (deleteValues: boolean) =>
    setValues(deleteValues ? [] : ['test1', 'test2']);

  const changeSomeValues = (removeTest2: boolean) =>
    setValues(removeTest2 ? ['test1'] : ['test1', 'test2']);

  const currentSelectedValues = selectedValues.filter((id) =>
    values.includes(id),
  );

  return (
    <>
      <Combobox
        {...args}
        multiple
        value={currentSelectedValues}
        onValueChange={handleComboboxChange}
      >
        {values.map((attachment) => {
          return (
            <Combobox.Option
              key={attachment}
              value={attachment}
              description={attachment}
              displayValue={attachment}
            />
          );
        })}
      </Combobox>
      <Switch onChange={(event) => changeAllValues(event.target.checked)}>
        Remove Values (Selected values remain unchanged as the combobox does not
        update when options are empty.)
      </Switch>
      <Switch onChange={(event) => changeSomeValues(event.target.checked)}>
        Remove test2 (this works)
      </Switch>
    </>
  );
};

export const WithNumberValues: StoryFn<typeof Combobox> = () => {
  return (
    <Combobox initialValue={['2000']}>
      <Combobox.Option id={'3000'} key={'3000'} value={'3000'}>
        some value
      </Combobox.Option>
      <Combobox.Option id={'2000'} key={'2000'} value={'2000'}>
        some other value
      </Combobox.Option>
    </Combobox>
  );
};
