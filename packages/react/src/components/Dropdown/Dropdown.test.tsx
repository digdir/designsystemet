import React, { useRef, useState } from 'react';
import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { DropdownProps } from './Dropdown';

import { Dropdown } from './';

const Comp = (args: Partial<DropdownProps>) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        ref={ref}
        onClick={() => setOpen(!open)}
      >
        trigger
      </button>
      <Dropdown
        open={open || args?.open}
        {...args}
        anchorEl={ref.current}
      >
        <Dropdown.Section>
          <Dropdown.Header>Links</Dropdown.Header>
          <Dropdown.Item>Item</Dropdown.Item>
          {args.children}
        </Dropdown.Section>
      </Dropdown>
    </>
  );
};

const render = async (props: Partial<DropdownProps> = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(<Comp {...props} />),
  };
};

describe('Dropdown', () => {
  it('should render dropdown on trigger-click when closed', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    expect(screen.queryByText('Item')).not.toBeInTheDocument();

    await user.click(dropdownTrigger);

    expect(screen.queryByText('Item')).toBeInTheDocument();
  });

  it('should close when we click the button twitce', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await user.click(dropdownTrigger);
    await user.click(dropdownTrigger);

    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('should render children', async () => {
    const { user } = await render({
      children: <Dropdown.Item>Item 2</Dropdown.Item>,
    });
    const dropdownTrigger = screen.getByRole('button');

    await user.click(dropdownTrigger);

    expect(screen.queryByText('Item 2')).toBeInTheDocument();
  });

  it('should close when we click outside', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await user.click(dropdownTrigger);

    expect(screen.queryByText('Item')).toBeInTheDocument();

    await user.click(document.body);

    setTimeout(() => {
      expect(screen.queryByText('Item')).not.toBeInTheDocument();
    }, 1000);
  });

  it('should close when we press ESC', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await user.click(dropdownTrigger);

    expect(screen.queryByText('Item')).toBeInTheDocument();

    await user.keyboard('[Escape]');

    setTimeout(() => {
      expect(screen.queryByText('Item')).not.toBeInTheDocument();
    }, 1000);
  });

  it('should not close if we click inisde the dropdown', async () => {
    const { user } = await render({
      children: <Dropdown.Item>Item 2</Dropdown.Item>,
    });
    const dropdownTrigger = screen.getByRole('button');

    await user.click(dropdownTrigger);

    expect(screen.queryByText('Item')).toBeInTheDocument();

    await user.click(screen.getByText('Item 2'));

    expect(screen.queryByText('Item')).toBeInTheDocument();
  });

  it('should be able to render `Dropdown.Item` as a link', async () => {
    const { user } = await render({
      children: (
        <Dropdown.Item
          as='a'
          href='#'
        >
          Item 2
        </Dropdown.Item>
      ),
    });
    const dropdownTrigger = screen.getByRole('button');

    await user.click(dropdownTrigger);

    expect(screen.getByText('Item 2')).toHaveAttribute('href', '#');
    expect(screen.getByText('Item 2').tagName).toBe('A');
  });
});
