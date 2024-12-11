import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from './';

describe('Search', () => {
  it('should clear input when clear button is clickd', async () => {
    renderRtl(
      <Search>
        <Search.Input aria-label='Søk' />
        <Search.Clear />
      </Search>,
    );

    const input = screen.getByRole('searchbox');
    const clearButton = screen.getByRole('button');

    expect(input).toHaveValue('');
    expect(clearButton).toBeInTheDocument();

    input.focus();

    expect(input).toHaveFocus();

    await act(async () => await userEvent.type(input, 'Hello, World!'));

    expect(input).toHaveValue('Hello, World!');

    await act(async () => await userEvent.click(clearButton));

    expect(input).toHaveValue('');
  });
});
