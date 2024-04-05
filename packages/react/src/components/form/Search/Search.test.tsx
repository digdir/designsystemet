import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { SearchProps } from './Search';
import { Search } from './Search';

describe('Search', () => {
  test('has correct value and label', () => {
    render({ value: 'test', label: 'label', clearButtonLabel: 'clear' });
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByText('clear')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct label when label is hidden', () => {
    render({ label: 'label', hideLabel: true });

    expect(screen.getByLabelText('label')).toBeDefined();
  });

  test('is invalid with correct error message', () => {
    render({ error: 'error-message' });

    const search = screen.getByRole('searchbox', {
      description: 'error-message',
    });
    expect(search).toBeDefined();
    expect(search).toBeInvalid();
  });
  test('is invalid with correct error message from errorId', () => {
    renderRtl(
      <>
        <span id='my-error'>my error message</span>
        <Search
          errorId='my-error'
          error
        />
      </>,
    );

    const search = screen.getByRole('searchbox', {
      description: 'my error message',
    });
    expect(search).toBeDefined();
    expect(search).toBeInvalid();
  });

  it('Triggers onBlur event when field loses focus', async () => {
    const onBlur = vi.fn();
    const { user } = render({ onBlur });
    const element = screen.getByRole('searchbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('Triggers onChange event for each keystroke', async () => {
    const onChange = vi.fn();
    const data = 'test';
    const { user } = render({ onChange });
    const element = screen.getByRole('searchbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.keyboard(data);
    expect(onChange).toHaveBeenCalledTimes(data.length);
  });

  it('Sets given id on search field', () => {
    const id = 'some-unique-id';
    render({ id });
    expect(screen.getByRole('searchbox')).toHaveAttribute('id', id);
  });

  it('Focuses on search field when label is clicked and id is not given', async () => {
    const label = 'Lorem ipsum';
    const { user } = render({ label });
    await user.click(screen.getByText(label));
    expect(screen.getByRole('searchbox')).toHaveFocus();
  });

  it('Focuses on search field when label is clicked and id is given', async () => {
    const label = 'Lorem ipsum';
    const { user } = render({ id: 'some-unique-id', label });
    await user.click(screen.getByText(label));
    expect(screen.getByRole('searchbox')).toHaveFocus();
  });

  it('clear value with clear button and focus is set to searchbox afterwards', async () => {
    const onClear = vi.fn();
    const clearButtonLabel = 'clear';
    const typedText = 'typed text by user';

    const { user } = render({ onClear, clearButtonLabel });

    const searchbox = screen.getByRole<HTMLInputElement>('searchbox');
    await user.type(searchbox, typedText);
    expect(searchbox.value).toBe(typedText);

    const clearButton = screen.getByText(clearButtonLabel);

    await user.click(clearButton);

    expect(onClear).toBeCalledWith(typedText);
    expect(searchbox.value).toBe('');
    expect(searchbox).toHaveFocus();
  });

  it('onSearchClick is triggered with correct search value when search button is interacted', async () => {
    const onSearchClick = vi.fn();
    const searchButtonLabel = 'search';
    const typedText = 'typed text by user';

    const { user } = render({
      onSearchClick,
      searchButtonLabel,
      variant: 'primary',
    });

    const searchbox = screen.getByRole<HTMLInputElement>('searchbox');
    await user.type(searchbox, typedText);
    expect(searchbox.value).toBe(typedText);

    const searchButton = screen.getByText(searchButtonLabel);

    await user.click(searchButton);

    expect(onSearchClick).toBeCalledWith(typedText);
  });

  it('trigger onSubmit in form by default', async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn();
    const typedText = 'typed text by user';

    renderRtl(
      <form onSubmit={onSubmit}>
        <Search />
      </form>,
    );

    const searchbox = screen.getByRole<HTMLInputElement>('searchbox');
    await user.type(searchbox, typedText);
    expect(searchbox.value).toBe(typedText);

    await user.keyboard('[Enter]');

    expect(onSubmit).toHaveBeenCalled();
  });
});

const render = (props: Partial<SearchProps> = {}) => {
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(
      <Search
        {...{
          onChange: vi.fn(),
          ...props,
        }}
      />,
    ),
  };
};
