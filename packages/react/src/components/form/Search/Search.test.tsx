import { render as renderRtl, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';

import type { SearchProps } from './Search';
import { Search } from './Search';

const user = userEvent.setup();

describe('Search', () => {
  test('has correct value and label', () => {
    render({ value: 'test', label: 'label' });
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  test('has correct label when label is hidden', () => {
    render({ label: 'label', hideLabel: true });

    expect(screen.getByLabelText('label')).toBeDefined();
  });

  test('is invalid with correct error message', () => {
    render({ error: 'error-message' });

    const search = screen.getByRole('textbox', {
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

    const search = screen.getByRole('textbox', {
      description: 'my error message',
    });
    expect(search).toBeDefined();
    expect(search).toBeInvalid();
  });

  it('Triggers onBlur event when field loses focus', async () => {
    const onBlur = jest.fn();
    render({ onBlur });
    const element = screen.getByRole('textbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('Triggers onChange event for each keystroke', async () => {
    const onChange = jest.fn();
    const data = 'test';
    render({ onChange });
    const element = screen.getByRole('textbox');
    await user.click(element);
    expect(element).toHaveFocus();
    await user.keyboard(data);
    expect(onChange).toHaveBeenCalledTimes(data.length);
  });

  it('Sets given id on search field', () => {
    const id = 'some-unique-id';
    render({ id });
    expect(screen.getByRole('textbox')).toHaveAttribute('id', id);
  });

  it('Focuses on search field when label is clicked and id is not given', async () => {
    const label = 'Lorem ipsum';
    render({ label });
    await user.click(screen.getByText(label));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Focuses on search field when label is clicked and id is given', async () => {
    const label = 'Lorem ipsum';
    render({ id: 'some-unique-id', label });
    await user.click(screen.getByText(label));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});

const render = (props: Partial<SearchProps> = {}) =>
  renderRtl(
    <Search
      {...{
        onChange: jest.fn(),
        ...props,
      }}
    />,
  );
