import { act, render, screen } from '@testing-library/react';
import { ToggleGroup } from './';

const keydown = (el: Element, key: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

describe('ToggleGroup', () => {
  test('has generated name for ToggleGroupItem children', () => {
    render(
      <ToggleGroup data-toggle-group='Label'>
        <ToggleGroup.Item value='test'>test</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item = screen.getByRole('radio');
    expect(item).toHaveAttribute('name');
  });

  test('has passed name to ToggleGroupItem children', (): void => {
    render(
      <ToggleGroup data-toggle-group='Label' name='my name'>
        <ToggleGroup.Item value='test'>test</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item = screen.getByRole<HTMLButtonElement>('radio');
    expect(item.name).toEqual('my name');
  });

  test('can navigate with tab and arrow keys', async () => {
    render(
      <ToggleGroup data-toggle-group='Label'>
        <ToggleGroup.Item value='test'>test</ToggleGroup.Item>
        <ToggleGroup.Item value='test2'>test2</ToggleGroup.Item>
        <ToggleGroup.Item value='test3'>test3</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item1 = screen.getByRole('radio', { name: 'test' });
    const item2 = screen.getByRole('radio', { name: 'test2' });
    const item3 = screen.getByRole('radio', { name: 'test3' });

    await act(async () => item1.focus());
    expect(item1).toHaveFocus();

    await act(async () => keydown(item1, 'ArrowRight'));
    expect(item2).toHaveFocus();

    await act(async () => keydown(item2, 'ArrowRight'));
    expect(item3).toHaveFocus();

    await act(async () => keydown(item3, 'ArrowLeft'));
    expect(item2).toHaveFocus();
  });

  test('arrow keys will skip disabled items', async () => {
    render(
      <ToggleGroup data-toggle-group='Label'>
        <ToggleGroup.Item value='test'>test</ToggleGroup.Item>
        <ToggleGroup.Item disabled value='test2'>
          test2
        </ToggleGroup.Item>
        <ToggleGroup.Item disabled value='test3'>
          test3
        </ToggleGroup.Item>
        <ToggleGroup.Item value='test4'>test4</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item1 = screen.getByRole('radio', { name: 'test' });
    const item4 = screen.getByRole('radio', { name: 'test4' });

    await act(async () => item1.focus());
    expect(item1).toHaveFocus();

    await act(async () => keydown(item1, 'ArrowRight'));
    expect(item4).toHaveFocus();

    await act(async () => keydown(item4, 'ArrowLEft'));
    expect(item1).toHaveFocus();
  });

  test('click will not check disabled item', async () => {
    const onChangeMock = vi.fn();

    render(
      <ToggleGroup
        data-toggle-group='Label'
        defaultValue='test1'
        onChange={onChangeMock}
      >
        <ToggleGroup.Item value='test1'>test1</ToggleGroup.Item>
        <ToggleGroup.Item disabled value='test2'>
          test2
        </ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item1 = screen.getByRole('radio', {
      name: 'test1',
    });
    const item2 = screen.getByRole('radio', {
      name: 'test2',
    });

    expect(item1).toHaveProperty('checked', true);
    expect(item2).toHaveProperty('checked', false);

    await act(async () => item2.parentElement?.click());
    expect(onChangeMock).toHaveBeenCalledTimes(0);
    expect(item2).toHaveProperty('checked', false);
  });

  test('has correct ToggleGroupItem defaultChecked & checked when defaultValue is used', () => {
    render(
      <ToggleGroup data-toggle-group='Label' defaultValue='test2'>
        <ToggleGroup.Item value='test1'>test1</ToggleGroup.Item>
        <ToggleGroup.Item value='test2'>test2</ToggleGroup.Item>
        <ToggleGroup.Item value='test3'>test3</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item = screen.getByRole<HTMLButtonElement>('radio', {
      name: 'test2',
    });
    expect(item).toHaveProperty('checked', true);
  });
  test('has passed clicked ToggleGroupItem value to onChange', async () => {
    const onChangeMock = vi.fn();

    render(
      <ToggleGroup data-toggle-group='Label' onChange={onChangeMock}>
        <ToggleGroup.Item value='test1'>test1</ToggleGroup.Item>
        <ToggleGroup.Item value='test2value'>test2</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item = screen.getByRole('radio', {
      name: 'test2',
    });

    expect(item).toHaveProperty('checked', false);

    await act(async () => item.parentElement?.click());
    expect(onChangeMock).toHaveBeenCalledWith('test2value');
    expect(item).toHaveProperty('checked', true);
  });
  test('has correct checked on correct ToggleGroupItem when clicked', async () => {
    const onChangeMock = vi.fn();

    render(
      <ToggleGroup
        data-toggle-group='Label'
        defaultValue='test1'
        onChange={onChangeMock}
      >
        <ToggleGroup.Item value='test1'>test1</ToggleGroup.Item>
        <ToggleGroup.Item value='test2'>test2</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const item1 = screen.getByRole('radio', {
      name: 'test1',
    });
    const item2 = screen.getByRole('radio', {
      name: 'test2',
    });

    expect(item1).toHaveProperty('checked', true);
    expect(item2).toHaveProperty('checked', false);

    await act(async () => item2.parentElement?.click());
    expect(onChangeMock).toHaveBeenCalledWith('test2');
    expect(item2).toHaveProperty('checked', true);
  });

  test('if we pass a name, we should have a hidden input with that name', () => {
    const name = 'my-name';
    const { container } = render(
      <ToggleGroup data-toggle-group='Label' name={name}>
        <ToggleGroup.Item value='test'>test</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const input = container.querySelector(`input[name="${name}"]`);
    expect(input).toBeDefined();
  });

  test('if we pass a name, we should have a hidden input with that name and value', () => {
    const name = 'my-name';
    const { container } = render(
      <ToggleGroup data-toggle-group='Label' name='my-name' defaultValue='test'>
        <ToggleGroup.Item value='test'>test</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const input = container.querySelector(`input[name="${name}"]`);
    expect(input).toHaveAttribute('value', 'test');
  });

  test('should send the value to a form when the form is submitted', async () => {
    const formSubmitPromise = new Promise<FormData>((resolve) => {
      const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        resolve(new FormData(event.currentTarget));
      };

      render(
        <form onSubmit={handleSubmit}>
          <ToggleGroup
            data-toggle-group='Label'
            name='test'
            defaultValue='test2'
          >
            <ToggleGroup.Item value='test1'>test1</ToggleGroup.Item>
            <ToggleGroup.Item value='test2'>test2</ToggleGroup.Item>
          </ToggleGroup>
          <button type='submit'>Submit</button>
        </form>,
      );
    });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await act(async () => submitButton.click());

    const formData = await formSubmitPromise;
    expect(formData.get('test')).toBe('test2');
  });

  test('if we dont pass a name, we should not have a hidden input', () => {
    render(
      <ToggleGroup data-toggle-group='Label'>
        <ToggleGroup.Item value='test'>test</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const input = document.querySelector('input[type="hidden"]');
    expect(input).toBeNull();
  });
});
