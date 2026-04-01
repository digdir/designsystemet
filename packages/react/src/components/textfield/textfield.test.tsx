import { act, render as renderRtl, screen } from '@testing-library/react';
import type { FieldCounterProps } from '../field';
import type { TextfieldProps } from './textfield';
import { Textfield } from './textfield';

const getCountText = async (text: string) => {
  const counter = screen.getByTestId('counter');
  return await vi.waitUntil(() => counter?.getAttribute('data-label') === text);
};
const withCounterTestId = (counter: number) =>
  ({
    'data-testid': 'counter',
    limit: counter,
  }) as FieldCounterProps;

describe('Textfield', () => {
  it('has correct value and label', () => {
    render({ value: 'test', label: 'label' });
    expect(screen.getByLabelText('label')).toBeDefined();
    expect(screen.getByDisplayValue('test')).toBeDefined();
  });

  it('has correct description', () => {
    render({ description: 'description', 'aria-label': 'label' });
    expect(
      screen.getByRole('textbox', { description: 'description' }),
    ).toBeDefined();
  });

  it('should become a textarea when multiline is true', () => {
    render({ multiline: true, 'aria-label': 'label' });
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('is invalid with correct error message', () => {
    render({ error: 'error-message', 'aria-label': 'label' });

    const input = screen.getByRole('textbox', { description: 'error-message' });
    expect(input).toBeDefined();
    expect(input).toBeInvalid();
  });

  it('has combined description when both description and error is set', () => {
    render({
      description: 'description',
      error: 'error-message',
      'aria-label': 'label',
    });

    const input = screen.getByRole('textbox', {
      description: 'error-message description',
    });
    expect(input).toBeDefined();
    expect(input).toBeInvalid();
  });

  it('Triggers onBlur event when field loses focus', async () => {
    const onBlur = vi.fn();
    render({ onBlur, 'aria-label': 'label' });
    const element = screen.getByRole('textbox');
    await act(async () => element.focus());
    expect(element).toHaveFocus();
    await act(async () => element.blur());
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  // TODO EIRIK: Test commented out because this tests if React works
  // it('Triggers onChange event', async () => {
  //   const onChange = vi.fn();
  //   render({ onChange, 'aria-label': 'label' });
  //   const element = screen.getByRole('textbox');
  //   await act(async () => element.focus());
  //   expect(element).toHaveFocus();
  //   await act(async () => keydown(element, 'a'));
  //   vi.waitFor(() => expect(onChange).toHaveBeenCalled()); // Let event bubble
  // });

  it('Sets given id on input field', () => {
    const id = 'some-unique-id';
    render({ id, 'aria-label': 'label' });
    expect(screen.getByRole('textbox')).toHaveAttribute('id', id);
  });

  it('Focuses on input field when label is clicked and id is not given', async () => {
    const label = 'Lorem ipsum';
    render({ label });
    await act(async () => screen.getByText(label).click());
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Focuses on input field when label is clicked and id is given', async () => {
    const label = 'Lorem ipsum';
    render({ id: 'some-unique-id', label });
    await act(async () => screen.getByText(label).click());
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('Has type attribute set to "text" by default', () => {
    render();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('Has given type attribute if set', () => {
    const type = 'tel';
    render({ type, 'aria-label': 'label' });
    expect(screen.getByRole('textbox')).toHaveAttribute('type', type);
  });

  it('updates counter when value prop changes programmatically', async () => {
    const { rerender } = renderRtl(
      <Textfield
        label='Test'
        counter={withCounterTestId(5)}
        value=''
        onChange={() => {}}
      />,
    );
    expect(await getCountText('5 tegn igjen')).toBeTruthy();

    rerender(
      <Textfield
        label='Test'
        counter={withCounterTestId(5)}
        value='123'
        onChange={() => {}}
      />,
    );

    expect(await getCountText('2 tegn igjen')).toBeTruthy();
  });

  it('shows over limit message when value exceeds limit via prop change', async () => {
    const { rerender } = renderRtl(
      <Textfield
        label='Test'
        counter={withCounterTestId(3)}
        value=''
        onChange={() => {}}
      />,
    );

    expect(await getCountText('3 tegn igjen')).toBeTruthy();

    rerender(
      <Textfield
        label='Test'
        counter={withCounterTestId(3)}
        value={'abcd'}
        onChange={() => {}}
      />,
    );

    expect(await getCountText('1 tegn for mye')).toBeTruthy();
  });

  it('Render counter before error validation messages', async () => {
    render({
      value: 'lorem',
      label: 'test',
      counter: withCounterTestId(2),
      error: 'Other invalid condition',
    });

    expect(await getCountText('3 tegn for mye')).toBeTruthy();
  });
});

const render = (
  props: TextfieldProps = {
    'aria-label': 'label',
  },
) => {
  vi.useFakeTimers();
  const result = renderRtl(
    <Textfield
      {...{
        onChange: vi.fn(),
        ...props,
      }}
    />,
  );
  vi.runAllTimers();
  vi.useRealTimers();
  return result;
};
