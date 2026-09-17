import { act, render, screen, waitFor } from '@testing-library/react';
import { Search } from './';

describe('Search', () => {
  it('should clear input when clear button is clickd', async () => {
    render(
      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear data-testid='button' />
      </Search>,
    );

    const input = screen.getByRole('searchbox') as HTMLInputElement;
    const clearButton = screen.getByTestId('button');

    expect(input).toHaveValue('');
    expect(clearButton).toBeInTheDocument();

    await act(async () => input.focus());
    expect(input).toHaveFocus();

    input.value = 'Hello, World!';
    expect(input).toHaveValue('Hello, World!');

    await act(async () => clearButton.click());
    expect(input).toHaveValue('');
  });

  it('toggles clear button visibility for programmatic input changes', async () => {
    render(
      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear data-testid='button' />
      </Search>,
    );

    const input = screen.getByRole('searchbox') as HTMLInputElement;
    const clearButton = screen.getByTestId('button');

    await waitFor(() => expect(clearButton).not.toBeVisible());

    input.value = 'Hello, World!';
    await waitFor(() => expect(clearButton).toBeVisible());

    input.value = '';
    await waitFor(() => expect(clearButton).not.toBeVisible());
  });
});
