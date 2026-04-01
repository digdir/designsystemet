import { render, screen } from '@testing-library/react';
import { Search } from './';

describe('Search', () => {
  it('should clear input when clear button is clickd', () => {
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

    input.focus();
    expect(input).toHaveFocus();

    input.value = 'Hello, World!';
    expect(input).toHaveValue('Hello, World!');

    clearButton.click();
    expect(input).toHaveValue('');
  });
});
