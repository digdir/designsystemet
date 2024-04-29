import type * as React from 'react';
import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ComboboxProps } from './Combobox';

import { Combobox } from '.';

const PLACES = [
  {
    name: 'Leikanger',
    value: 'leikanger',
    description: 'Vestland',
  },
  {
    name: 'Oslo',
    value: 'oslo',
    description: 'Oslo',
  },
  {
    name: 'Brønnøysund',
    value: 'bronnoysund',
    description: 'Nordland',
  },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Comp = (args: Partial<ComboboxProps>) => {
  return (
    <>
      <Combobox {...args}>
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((option, index) => (
          <Combobox.Option
            key={index}
            value={option.value}
            displayValue={option.name}
          >
            {option.name}
          </Combobox.Option>
        ))}
      </Combobox>
    </>
  );
};

const render = async (props: Partial<ComboboxProps> = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(<Comp {...props} />),
  };
};

describe('Combobox', () => {
  it('should render combobox', async () => {
    await render();
    const combobox = screen.getByRole('combobox');

    expect(combobox).toBeInTheDocument();
  });

  it('should render children when we click on the combobox', async () => {
    await render();
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);

    expect(screen.getByText('Leikanger')).toBeInTheDocument();
  });

  it('should close the dropdown when we click outside', async () => {
    const { user } = await render();
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    expect(screen.getByText('Leikanger')).toBeInTheDocument();

    await user.click(document.body);
    await wait(300);
    expect(screen.queryByText('Leikanger')).not.toBeInTheDocument();
  });

  it('should close when we click Escape', async () => {
    const { user } = await render({ label: 'closeOnEscape' });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    expect(screen.getByText('Leikanger')).toBeInTheDocument();

    await user.type(combobox, '{Escape}');

    await wait(500);

    expect(screen.queryByText('Leikanger')).not.toBeInTheDocument();
  });

  it('should set call `onValueChange` on the Combobox when we click and option', async () => {
    const onValueChange = vi.fn();
    await render({ onValueChange });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));

    await wait(500);
    expect(onValueChange).toHaveBeenCalledWith(['leikanger']);
  });

  it('should call `onValueChange` with multiple values when we click multiple options', async () => {
    const onValueChange = vi.fn();
    await render({ onValueChange, multiple: true });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await wait(500);
    expect(onValueChange).toHaveBeenCalledWith(['leikanger']);

    await userEvent.click(screen.getByText('Oslo'));
    await wait(500);
    expect(onValueChange).toHaveBeenCalledWith(['leikanger', 'oslo']);
  });

  it('should show a chip of a selected option in multiple mode', async () => {
    const { user } = await render({ multiple: true });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await wait(500);
    await user.click(document.body);
    await wait(500);

    expect(screen.getByText('Leikanger')).toBeInTheDocument();
  });

  it('should remove a chip when we click on it', async () => {
    const { user } = await render({ multiple: true });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await wait(500);
    await user.click(document.body);
    await wait(500);
    expect(screen.getByText('Leikanger')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Leikanger'));
    await user.click(document.body);
    await wait(500);
    expect(screen.queryByText('Leikanger')).not.toBeInTheDocument();
  });

  it('should remove all values when we click on the clear button', async () => {
    const onValueChange = vi.fn();
    const { user } = await render({ multiple: true, onValueChange });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await wait(100);
    await userEvent.click(screen.getByText('Leikanger'));
    await wait(500);
    await userEvent.click(screen.getByText('Oslo'));
    await wait(500);
    await user.click(document.body);
    await wait(500);
    expect(screen.getByText('Leikanger')).toBeInTheDocument();
    expect(screen.getByText('Oslo')).toBeInTheDocument();

    // get clear button by its classname .clearButton
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find((button) => button.className.includes('clearButton'));
    if (!clearButton) {
      throw new Error('Could not find clear button');
    }
    await userEvent.click(clearButton);

    setTimeout(() => {
      expect(screen.queryByText('Leikanger')).not.toBeInTheDocument();
      expect(screen.queryByText('Oslo')).not.toBeInTheDocument();
      expect(onValueChange).toHaveBeenCalledWith([]);
    }, 1000);
  });

  it('should show "Fant ingen treff", when input does not match any values', async () => {
    await render();
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.type(combobox, 'test');

    expect(screen.getByText('Fant ingen treff')).toBeInTheDocument();
  });

  it('should work in a form if we pass a name', async () => {
    const formSubmitPromise = new Promise<FormData>((resolve) => {
      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        resolve(new FormData(event.currentTarget));
      };

      renderRtl(
        <form onSubmit={handleSubmit}>
          <Combobox name='test'>
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            {PLACES.map((option, index) => (
              <Combobox.Option
                key={index}
                value={option.value}
                displayValue={option.name}
              >
                {option.name}
              </Combobox.Option>
            ))}
          </Combobox>
          <button type='submit'>Submit</button>
        </form>,
      );
    });

    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);

    await userEvent.click(screen.getByText('Leikanger'));

    await wait(1000);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    const formData = await formSubmitPromise;
    expect(formData.get('test')).toBe('leikanger');
  });

  it('should work in a form if we pass a name, and we click multiple', async () => {
    const formSubmitPromise = new Promise<FormData>((resolve) => {
      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        resolve(new FormData(event.currentTarget));
      };

      renderRtl(
        <form onSubmit={handleSubmit}>
          <Combobox
            name='test'
            multiple={true}
          >
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            {PLACES.map((option, index) => (
              <Combobox.Option
                key={index}
                value={option.value}
                displayValue={option.name}
              >
                {option.name}
              </Combobox.Option>
            ))}
          </Combobox>
          <button
            data-testid='submit'
            type='submit'
          >
            Submit
          </button>
        </form>,
      );
    });

    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);

    await userEvent.click(screen.getByText('Leikanger'));
    await wait(100);
    await userEvent.click(screen.getByText('Oslo'));
    await wait(100);

    const submitButton = screen.getAllByTestId('submit')[0];

    await userEvent.click(submitButton);

    const formData = await formSubmitPromise;
    expect(formData.getAll('test')).toEqual(['leikanger', 'oslo']);
  });

  it('should only call onValueChange once when we click the same option fast twice', async () => {
    const onValueChange = vi.fn();
    await render({ onValueChange, multiple: true });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await userEvent.click(screen.getByText('Leikanger'));

    setTimeout(() => {
      expect(onValueChange).toHaveBeenCalledTimes(1);
    }, 100);
  });

  it('should add aria-busy="true" when loading', async () => {
    await render({ loading: true });
    const combobox = screen.getByRole('combobox');

    expect(combobox).toHaveAttribute('aria-busy', 'true');
  });
});
