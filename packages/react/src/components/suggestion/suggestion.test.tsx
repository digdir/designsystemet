import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import {
  Suggestion,
  type SuggestionItem,
  type SuggestionMultipleProps,
  type SuggestionSingleProps,
} from './suggestion';
import { SuggestionEmpty } from './suggestion-empty';
import { SuggestionInput } from './suggestion-input';
import { SuggestionList } from './suggestion-list';
import { SuggestionOption } from './suggestion-option';
import { SuggestionToggle } from './suggestion-toggle';

const norway = { label: 'Norway', value: 'norway' };
const norway2 = { label: 'Norway', value: 'norway-2' };
const sweden = { label: 'Sweden', value: 'sweden' };

const places = ['Sogndal', 'Oslo', 'Stavanger'];
const placeLabel = 'Place';

function ControlledSuggestion({
  selected = norway,
  onSelectedChange,
}: {
  selected?: typeof norway;
  onSelectedChange: (item: typeof norway | null) => void;
}) {
  return (
    <Suggestion
      filter={false}
      selected={selected}
      onSelectedChange={onSelectedChange}
    >
      <SuggestionInput aria-label='Country' />
      <SuggestionList>
        <SuggestionOption value={norway.value}>{norway.label}</SuggestionOption>
        <SuggestionOption value={sweden.value}>{sweden.label}</SuggestionOption>
      </SuggestionList>
    </Suggestion>
  );
}

function Places({
  children,
  emptyText = 'No matches',
  ...rest
}: (SuggestionSingleProps | SuggestionMultipleProps) & {
  emptyText?: string;
}) {
  return (
    <Suggestion {...(rest as SuggestionSingleProps)}>
      <SuggestionInput aria-label={placeLabel} />
      <SuggestionToggle />
      <SuggestionList>
        <SuggestionEmpty data-empty={emptyText} />
        {places.map((place) => (
          <SuggestionOption key={place} label={place} value={place}>
            {place}
          </SuggestionOption>
        ))}
      </SuggestionList>
      {children}
    </Suggestion>
  );
}

/* Wait for <ds-suggestion> to upgrade the input before querying by role */
const getInput = (name: string) =>
  waitFor(() => screen.getByRole<HTMLInputElement>('combobox', { name }));

/* Chips for the selected items are rendered as <data> by Suggestion */
const getChipValues = () =>
  Array.from(
    document.querySelectorAll<HTMLDataElement>('ds-suggestion > data'),
  ).map((chip) => chip.value);

/* The empty option is excluded, as it is never touched by the filter */
const getOptionStates = () =>
  Array.from(
    document.querySelectorAll<HTMLOptionElement>('u-option:not([data-empty])'),
  ).map(({ value, disabled }) => [value, disabled]);

/**
 * Types a value matching no option, leaving the option for creating a new value
 * as the only one in the list.
 *
 * The create option is the empty option with `data-create` added, and chips for
 * selected items also have `role="option"`, so narrow down to `u-option`.
 * Options not matching the input are `aria-hidden` and thus already left out.
 */
async function typeUnknownValue(input: HTMLInputElement, value: string) {
  await userEvent.clear(input);
  await userEvent.type(input, value);

  return waitFor(() => {
    const [createOption, ...rest] = screen
      .getAllByRole('option')
      .filter((option) => option.matches('u-option'));

    expect(rest).toHaveLength(0);
    expect(createOption).toHaveAttribute('data-create');
    return createOption;
  });
}

describe('Suggestion', () => {
  it('keeps the input synchronized with the selected prop when a change is not accepted', async () => {
    const onSelectedChange = vi.fn();
    render(<ControlledSuggestion onSelectedChange={onSelectedChange} />);

    const input = screen.getByRole<HTMLInputElement>('combobox', {
      name: 'Country',
    });
    await waitFor(() => expect(input.value).toBe(norway.label));

    const suggestion = document.querySelector('ds-suggestion');
    const proposedItem = document.createElement('data');
    proposedItem.value = sweden.value;
    proposedItem.textContent = sweden.label;

    await act(async () =>
      suggestion?.dispatchEvent(
        new CustomEvent('comboboxbeforeselect', {
          bubbles: true,
          cancelable: true,
          detail: proposedItem,
        }),
      ),
    );

    expect(onSelectedChange).toHaveBeenCalledWith(sweden);
    expect(input.value).toBe(norway.label);
  });

  it('synchronizes the input when the selected prop changes', async () => {
    const onSelectedChange = vi.fn();
    const { rerender } = render(
      <ControlledSuggestion onSelectedChange={onSelectedChange} />,
    );
    const input = screen.getByRole<HTMLInputElement>('combobox', {
      name: 'Country',
    });
    await waitFor(() => expect(input.value).toBe(norway.label));

    rerender(
      <ControlledSuggestion
        selected={sweden}
        onSelectedChange={onSelectedChange}
      />,
    );

    await waitFor(() => expect(input.value).toBe(sweden.label));
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it('keeps the clicked option despite same label on blur in single mode', async () => {
    const onSelectedChange = vi.fn();
    const Comp = ({
      onSelectedChange,
    }: {
      onSelectedChange: (item: SuggestionItem | null) => void;
    }) => {
      const [selected, setSelected] = useState<SuggestionItem | null>(norway);
      return (
        <Suggestion
          selected={selected}
          onSelectedChange={(selected) => {
            onSelectedChange(selected);
            setSelected(selected);
          }}
        >
          <SuggestionInput aria-label='Country' />
          <SuggestionList>
            <SuggestionOption value={norway.value}>
              {norway.label}
            </SuggestionOption>
            <SuggestionOption value={norway2.value}>
              {norway2.label}
            </SuggestionOption>
          </SuggestionList>
        </Suggestion>
      );
    };

    render(<Comp onSelectedChange={onSelectedChange} />);
    const input = screen.getByRole<HTMLInputElement>('combobox', {
      name: 'Country',
    });
    await waitFor(() => expect(input.value).toBe(norway.label));

    input.click();
    screen.getAllByRole('option').at(1)?.click();
    await waitFor(() => expect(input.value).toBe(norway2.label));
    expect(onSelectedChange).toHaveBeenCalledOnce();

    input.blur();
    await waitFor(() => expect(input.value).toBe(norway2.label));
    expect(onSelectedChange).toHaveBeenCalledOnce();
  });

  it('opens the list when clicking the toggle button', async () => {
    render(<Places />);
    await getInput(placeLabel);

    const toggle = screen.getByRole('button', { name: 'Valg' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders defaultSelected when uncontrolled', async () => {
    render(<Places defaultSelected='Sogndal' />);
    const input = await getInput(placeLabel);

    await waitFor(() => expect(input).toHaveValue('Sogndal'));
  });

  it('renders a chip per defaultSelected item when multiple', async () => {
    render(<Places multiple defaultSelected={['Sogndal', 'Oslo']} />);
    await getInput(placeLabel);

    expect(getChipValues()).toEqual(['Sogndal', 'Oslo']);
  });

  it('keeps the chips synchronized with the selected prop when multiple', async () => {
    const Comp = () => {
      const [selected, setSelected] = useState(['Oslo']);
      return (
        <>
          <Places
            multiple
            selected={selected}
            onSelectedChange={(items) =>
              setSelected(items.map(({ value }) => value))
            }
          />
          <button
            type='button'
            onClick={() => setSelected(['Sogndal', 'Stavanger'])}
          >
            Set places
          </button>
        </>
      );
    };

    render(<Comp />);
    const input = await getInput(placeLabel);
    expect(getChipValues()).toEqual(['Oslo']);

    await userEvent.click(screen.getByRole('button', { name: 'Set places' }));

    await waitFor(() =>
      expect(getChipValues()).toEqual(['Sogndal', 'Stavanger']),
    );
    expect(input).toHaveValue('');
  });

  it('offers the option to create a value when nothing matches', async () => {
    render(<Places creatable emptyText='Add «%s»' />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    const createOption = await typeUnknownValue(input, 'Does not exist');

    /* `data-create` is the `data-empty` text, or its CSS variable, with the
       current input value substituted for `%s` */
    expect(createOption).toHaveAttribute('data-create', 'Add «Does not exist»');
    expect(createOption).toHaveValue('Does not exist');
  });

  it('makes a created value the selected item in single mode', async () => {
    const onSelectedChange = vi.fn();
    const Comp = () => {
      const [selected, setSelected] = useState('');
      return (
        <Places
          creatable
          selected={selected}
          onSelectedChange={(item) => {
            onSelectedChange(item);
            setSelected(item?.value ?? '');
          }}
        />
      );
    };

    render(<Comp />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.click(await typeUnknownValue(input, 'Does not exist'));

    await waitFor(() => expect(input).toHaveValue('Does not exist'));
    expect(onSelectedChange).toHaveBeenCalledWith({
      label: 'Does not exist',
      value: 'Does not exist',
    });
  });

  it('keeps the already selected items when a value is created in multiple mode', async () => {
    const Comp = () => {
      const [selected, setSelected] = useState(['Oslo']);
      return (
        <Places
          creatable
          multiple
          selected={selected}
          onSelectedChange={(items) =>
            setSelected(items.map(({ value }) => value))
          }
        />
      );
    };

    render(<Comp />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.click(await typeUnknownValue(input, 'Does not exist'));

    await waitFor(() =>
      expect(getChipValues()).toEqual(['Oslo', 'Does not exist']),
    );
  });

  it('renders a chip for each created value in multiple mode', async () => {
    render(<Places creatable multiple />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.click(await typeUnknownValue(input, 'Does not exist'));
    await userEvent.click(await typeUnknownValue(input, 'Neither does this'));

    await waitFor(() =>
      expect(getChipValues()).toEqual(['Does not exist', 'Neither does this']),
    );
  });

  it('keeps the clicked option on blur after a substring search', async () => {
    const onSelectedChange = vi.fn();
    render(
      <Places
        creatable
        emptyText='Legg til %s'
        onSelectedChange={onSelectedChange}
      />,
    );
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.type(input, 'slo');

    const oslo = await waitFor(() =>
      screen.getByRole('option', { name: 'Oslo' }),
    );
    await userEvent.click(oslo);
    await waitFor(() => expect(input).toHaveValue('Oslo'));
    expect(onSelectedChange).toHaveBeenCalledOnce();

    /* In v1.18 and earlier the input was reset to the typed query on blur,
       and onSelectedChange fired again with the query as both label and
       value. Fixed in v1.19 by the u-combobox 2.1.0 upgrade. */
    await userEvent.click(document.body);
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-expanded', 'false'),
    );
    expect(input).toHaveValue('Oslo');
    expect(onSelectedChange).toHaveBeenCalledOnce();
  });

  it('disables the options rejected by a custom filter', async () => {
    render(
      <Places
        filter={({ index, input }) =>
          !input.value || index === Number(input.value) - 1
        }
      />,
    );
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    expect(getOptionStates()).toEqual([
      ['Sogndal', false],
      ['Oslo', false],
      ['Stavanger', false],
    ]);

    /* The empty option is not counted, so index 1 is the second place */
    await userEvent.type(input, '2');
    await waitFor(() =>
      expect(getOptionStates()).toEqual([
        ['Sogndal', true],
        ['Oslo', false],
        ['Stavanger', true],
      ]),
    );
  });

  it('keeps every option enabled when filter is false', async () => {
    render(<Places filter={false} defaultSelected='Sogndal' />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);

    await waitFor(() => expect(input).toHaveValue('Sogndal'));
    expect(getOptionStates()).toEqual([
      ['Sogndal', false],
      ['Oslo', false],
      ['Stavanger', false],
    ]);
  });
});
