import React from 'react';
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

const Comp = (args: Partial<ComboboxProps>) => {
  return (
    <>
      <Combobox {...args}>
        <Combobox.Empty>Fant ingen treff</Combobox.Empty>
        {PLACES.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Item>
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
    setTimeout(() => {
      expect(screen.queryByText('Leikanger')).not.toBeInTheDocument();
    }, 1000);
  });

  it('should close when we click Escape', async () => {
    const { user } = await render();
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    expect(screen.getByText('Leikanger')).toBeInTheDocument();

    await user.type(combobox, '{esc}');
    setTimeout(() => {
      expect(screen.queryByText('Leikanger')).not.toBeInTheDocument();
    }, 3000);
  });

  it('should set call `onValueChange` on the Combobox when we click and item', async () => {
    const onValueChange = jest.fn();
    await render({ onValueChange });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));

    expect(onValueChange).toHaveBeenCalledWith(['leikanger']);
  });

  it('should call `onValueChange` with multiple values when we click multiple items', async () => {
    const onValueChange = jest.fn();
    await render({ onValueChange, multiple: true });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await userEvent.click(screen.getByText('Oslo'));

    expect(onValueChange).toHaveBeenCalledWith(['leikanger', 'oslo']);
  });

  it('should show a chip of a selected item in multiple mode', async () => {
    const { user } = await render({ multiple: true });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await user.click(document.body);

    expect(screen.getByText('Leikanger')).toBeInTheDocument();
  });

  it('should remove a chip when we click on it', async () => {
    const { user } = await render({ multiple: true });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await user.click(document.body);
    expect(screen.getByText('Leikanger')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Leikanger'));
    setTimeout(() => {
      expect(screen.queryByText('Leikanger')).not.toBeInTheDocument();
    }, 1000);
  });

  it('should remove all values when we click on the clear button', async () => {
    const onValueChange = jest.fn();
    const { user } = await render({ multiple: true, onValueChange });
    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);
    await userEvent.click(screen.getByText('Leikanger'));
    await userEvent.click(screen.getByText('Oslo'));
    await user.click(document.body);
    expect(screen.getByText('Leikanger')).toBeInTheDocument();
    expect(screen.getByText('Oslo')).toBeInTheDocument();

    // get clear button by its classname .clearButton
    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find((button) =>
      button.className.includes('clearButton'),
    );
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
});
