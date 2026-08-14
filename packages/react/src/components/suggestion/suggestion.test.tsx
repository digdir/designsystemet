import { act, render, screen, waitFor } from '@testing-library/react';
import { Suggestion } from './suggestion';
import { SuggestionInput } from './suggestion-input';
import { SuggestionList } from './suggestion-list';
import { SuggestionOption } from './suggestion-option';

const norway = { label: 'Norway', value: 'norway' };
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
    expect(input).toHaveValue(norway.label);
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
});
