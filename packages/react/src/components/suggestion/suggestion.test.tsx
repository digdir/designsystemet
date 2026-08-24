import type { DSSuggestionElement } from '@digdir/designsystemet-web';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { Suggestion, type SuggestionItem } from './suggestion';
import { SuggestionInput } from './suggestion-input';
import { SuggestionList } from './suggestion-list';
import { SuggestionOption } from './suggestion-option';

const norway = { label: 'Norway', value: 'norway' };
const norway2 = { label: 'Norway', value: 'norway-2' };
const sweden = { label: 'Sweden', value: 'sweden' };

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

describe('Suggestion', () => {
  it('keeps the input synchronized with the selected prop when a change is not accepted', async () => {
    const onSelectedChange = vi.fn();
    render(<ControlledSuggestion onSelectedChange={onSelectedChange} />);

    const input = screen.getByRole<HTMLInputElement>('combobox', {
      name: 'Country',
    });
    await waitFor(() => expect(input).toHaveValue(norway.label));

    const suggestion =
      document.querySelector<DSSuggestionElement>('ds-suggestion');
    await waitFor(() => expect(suggestion?.control).toBe(input));
    const dispatchInput = vi.spyOn(input, 'dispatchEvent');
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
    expect(input).toHaveValue(norway.label);
    expect(dispatchInput).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'input', bubbles: true }),
    );
  });

  it('synchronizes the input when the selected prop changes', async () => {
    const onSelectedChange = vi.fn();
    const { rerender } = render(
      <ControlledSuggestion onSelectedChange={onSelectedChange} />,
    );
    const input = screen.getByRole<HTMLInputElement>('combobox', {
      name: 'Country',
    });
    await waitFor(() => expect(input).toHaveValue(norway.label));

    rerender(
      <ControlledSuggestion
        selected={sweden}
        onSelectedChange={onSelectedChange}
      />,
    );

    await waitFor(() => expect(input).toHaveValue(sweden.label));
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it('keeps the clicked option despite same label on blur in single mode', async () => {
    const onSelectedChange = vi.fn();
    const Comp = ({
      onSelectedChange,
    }: {
      onSelectedChange: (item: SuggestionItem | null) => void;
    }) => {
      const [selected, setSelected] = useState<SuggestionItem | null>(norway2);
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
    await waitFor(() => expect(input).toHaveValue(norway.label));

    input.click();
    screen.getAllByRole('option').at(1)?.click();
    await waitFor(() => expect(input).toHaveValue(norway2.label));
    expect(onSelectedChange).toHaveBeenCalledOnce();

    input.blur();
    await waitFor(() => expect(input).toHaveValue(norway2.label));
    expect(onSelectedChange).toHaveBeenCalledOnce();
  });
});
