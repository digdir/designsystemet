import type { SuggestionItem } from '@digdir/designsystemet-web';
import { suggestion } from '@digdir/designsystemet-web';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Suggestion, type SuggestionProps } from './suggestion';
import { SuggestionInput } from './suggestion-input';
import { SuggestionList } from './suggestion-list';
import { SuggestionOption } from './suggestion-option';
import { SuggestionToggle } from './suggestion-toggle';

const norway = { label: 'Norway', value: 'norway' };
const norway2 = { label: 'Norway', value: 'norway-2' };
const sweden = { label: 'Sweden', value: 'sweden' };

const places = ['Sogndal', 'Oslo', 'Stavanger'];
const placeLabel = 'Place';

/* Renders the selected item(s) as <data> elements, as done when controlling Suggestion */
const renderData = ({ label, value }: SuggestionItem) => (
  <data key={value} value={value}>
    {label}
  </data>
);

function Countries({
  selected,
  ...rest
}: SuggestionProps & { selected: SuggestionItem | null }) {
  return (
    <Suggestion {...rest}>
      {suggestion(selected, renderData)}
      <SuggestionInput aria-label='Country' />
      <SuggestionList data-nofilter>
        <SuggestionOption value={norway.value}>{norway.label}</SuggestionOption>
        <SuggestionOption value={norway2.value}>
          {norway2.label}
        </SuggestionOption>
        <SuggestionOption value={sweden.value}>{sweden.label}</SuggestionOption>
      </SuggestionList>
    </Suggestion>
  );
}

function Places({
  children,
  emptyText = 'No matches',
  nofilter,
  options = places,
  ...rest
}: SuggestionProps & {
  emptyText?: string;
  nofilter?: boolean;
  options?: string[];
}) {
  return (
    <Suggestion {...rest}>
      {children}
      <SuggestionInput aria-label={placeLabel} />
      <SuggestionToggle />
      <SuggestionList data-nofilter={nofilter || undefined}>
        <SuggestionOption data-empty={emptyText} />
        {options.map((place) => (
          <SuggestionOption key={place} label={place} value={place}>
            {place}
          </SuggestionOption>
        ))}
      </SuggestionList>
    </Suggestion>
  );
}

function ControlledPlace({
  initial = null,
  onSelect,
  ...rest
}: SuggestionProps & {
  initial?: string | null;
  onSelect?: (item: SuggestionItem | null) => void;
}) {
  const [selected, setSelected] = useState(suggestion(initial));
  return (
    <Places
      {...rest}
      oncomboboxbeforeselect={(event) => {
        const next = suggestion(selected, event);
        onSelect?.(next);
        setSelected(next);
      }}
    >
      {suggestion(selected, renderData)}
    </Places>
  );
}

function ControlledPlaces({
  initial = [],
  ...rest
}: SuggestionProps & { initial?: string[] }) {
  const [selected, setSelected] = useState(suggestion(initial));
  return (
    <>
      <Places
        {...rest}
        data-multiple
        oncomboboxbeforeselect={(event) =>
          setSelected(suggestion(selected, event))
        }
      >
        {suggestion(selected, renderData)}
      </Places>
      <button
        type='button'
        onClick={() => setSelected(suggestion(['Sogndal', 'Stavanger']))}
      >
        Set places
      </button>
    </>
  );
}

/* Wait for <ds-suggestion> to upgrade the input before querying by role */
const getInput = (name: string) =>
  waitFor(() => screen.getByRole<HTMLInputElement>('combobox', { name }));

/* Chips for the selected items are the <data> elements in Suggestion */
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
  it('keeps the input synchronized with the selected item when a change is not accepted', async () => {
    const onSelect = vi.fn();
    render(
      <Countries
        selected={norway}
        oncomboboxbeforeselect={(event) => onSelect(suggestion(norway, event))}
      />,
    );

    const input = await getInput('Country');
    await waitFor(() => expect(input.value).toBe(norway.label));

    const self = document.querySelector('ds-suggestion');
    const proposedItem = document.createElement('data');
    proposedItem.value = sweden.value;
    proposedItem.textContent = sweden.label;

    await act(async () =>
      self?.dispatchEvent(
        new CustomEvent('comboboxbeforeselect', {
          bubbles: true,
          cancelable: true,
          detail: proposedItem,
        }),
      ),
    );

    expect(onSelect).toHaveBeenCalledWith(sweden);
    expect(input.value).toBe(norway.label);
  });

  it('synchronizes the input when the selected item changes', async () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <Countries selected={norway} oncomboboxbeforeselect={onSelect} />,
    );
    const input = await getInput('Country');
    await waitFor(() => expect(input.value).toBe(norway.label));

    rerender(<Countries selected={sweden} oncomboboxbeforeselect={onSelect} />);

    await waitFor(() => expect(input.value).toBe(sweden.label));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('keeps the clicked option despite same label on blur in single mode', async () => {
    const onSelect = vi.fn();
    const Comp = () => {
      const [selected, setSelected] = useState(suggestion(norway));
      return (
        <Countries
          selected={selected}
          oncomboboxbeforeselect={(event) => {
            const next = suggestion(selected, event);
            onSelect(next);
            setSelected(next);
          }}
        />
      );
    };

    render(<Comp />);
    const input = await getInput('Country');
    await waitFor(() => expect(input.value).toBe(norway.label));

    input.click();
    screen.getAllByRole('option').at(1)?.click();
    await waitFor(() => expect(input.value).toBe(norway2.label));
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(norway2);

    input.blur();
    await waitFor(() => expect(input.value).toBe(norway2.label));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('opens the list when clicking the toggle button', async () => {
    render(<Places />);
    await getInput(placeLabel);

    /* The toggle name is CSS content in shadow DOM, which testing-library can not compute */
    const toggle = screen.getByRole('button', { expanded: false });

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders initial <data> when uncontrolled', async () => {
    render(
      <Places>
        <data value='Sogndal'>Sogndal</data>
      </Places>,
    );
    const input = await getInput(placeLabel);

    await waitFor(() => expect(input).toHaveValue('Sogndal'));
  });

  it('renders a chip per initial <data> when multiple', async () => {
    render(
      <Places data-multiple>
        <data value='Sogndal'>Sogndal</data>
        <data value='Oslo'>Oslo</data>
      </Places>,
    );
    await getInput(placeLabel);

    expect(getChipValues()).toEqual(['Sogndal', 'Oslo']);
  });

  it('adds more than two chips when controlled and multiple', async () => {
    render(<ControlledPlaces initial={['Oslo']} />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: 'Sogndal' }));
    await userEvent.click(screen.getByRole('option', { name: 'Stavanger' }));

    await waitFor(() =>
      expect(getChipValues()).toEqual(['Oslo', 'Sogndal', 'Stavanger']),
    );
  });

  it('keeps the chips synchronized with the selected items when multiple', async () => {
    render(<ControlledPlaces initial={['Oslo']} />);
    const input = await getInput(placeLabel);
    expect(getChipValues()).toEqual(['Oslo']);

    await userEvent.click(screen.getByRole('button', { name: 'Set places' }));

    await waitFor(() =>
      expect(getChipValues()).toEqual(['Sogndal', 'Stavanger']),
    );
    expect(input).toHaveValue('');
  });

  it('offers the option to create a value when nothing matches', async () => {
    render(<Places data-creatable emptyText='Add «%s»' />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    const createOption = await typeUnknownValue(input, 'Does not exist');

    /* `data-create` is the `data-empty` text, or its CSS variable, with the
       current input value substituted for `%s` */
    expect(createOption).toHaveAttribute('data-create', 'Add «Does not exist»');
    expect(createOption).toHaveValue('Does not exist');
  });

  it('makes a created value the selected item in single mode', async () => {
    const onSelect = vi.fn();
    render(<ControlledPlace data-creatable onSelect={onSelect} />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.click(await typeUnknownValue(input, 'Does not exist'));

    await waitFor(() => expect(input).toHaveValue('Does not exist'));
    expect(onSelect).toHaveBeenCalledWith({
      label: 'Does not exist',
      value: 'Does not exist',
    });
  });

  it('keeps the already selected items when a value is created in multiple mode', async () => {
    render(<ControlledPlaces data-creatable initial={['Oslo']} />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.click(await typeUnknownValue(input, 'Does not exist'));

    await waitFor(() =>
      expect(getChipValues()).toEqual(['Oslo', 'Does not exist']),
    );
  });

  it('renders a chip for each created value in multiple mode', async () => {
    render(<Places data-creatable data-multiple />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    await userEvent.click(await typeUnknownValue(input, 'Does not exist'));
    await userEvent.click(await typeUnknownValue(input, 'Neither does this'));

    await waitFor(() =>
      expect(getChipValues()).toEqual(['Does not exist', 'Neither does this']),
    );
  });

  it('keeps the clicked option on blur after a substring search', async () => {
    const onAfterSelect = vi.fn();
    render(
      <Places
        data-creatable
        emptyText='Legg til %s'
        oncomboboxafterselect={onAfterSelect}
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
    expect(onAfterSelect).toHaveBeenCalledOnce();

    /* In v1.18 and earlier the input was reset to the typed query on blur,
       and a new item was selected with the query as both label and value.
       Fixed in v1.19 by the u-combobox 2.1.0 upgrade. */
    await userEvent.click(document.body);
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-expanded', 'false'),
    );
    expect(input).toHaveValue('Oslo');
    expect(onAfterSelect).toHaveBeenCalledOnce();
  });

  it('renders only the options matched by custom filtering', async () => {
    const Comp = () => {
      const [value, setValue] = useState('');
      return (
        <Places
          nofilter
          options={places.filter(
            (_, index) => !value || index === Number(value) - 1,
          )}
          onInput={(event) =>
            setValue((event.target as HTMLInputElement).value)
          }
        />
      );
    };

    render(<Comp />);
    const input = await getInput(placeLabel);

    await userEvent.click(input);
    expect(getOptionStates()).toEqual([
      ['Sogndal', false],
      ['Oslo', false],
      ['Stavanger', false],
    ]);

    await userEvent.type(input, '2');
    await waitFor(() => expect(getOptionStates()).toEqual([['Oslo', false]]));
  });

  it('keeps every option enabled when data-nofilter is set', async () => {
    render(
      <Places nofilter>
        <data value='Sogndal'>Sogndal</data>
      </Places>,
    );
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
