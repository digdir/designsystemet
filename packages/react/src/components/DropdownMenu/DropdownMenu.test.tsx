import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { DropdownMenuRootProps } from './DropdownMenuRoot';

import { DropdownMenu } from '.';

const Comp = (args: Partial<DropdownMenuRootProps>) => {
  return (
    <DropdownMenu.Root {...args}>
      <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group heading='Links'>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
          {args.children}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const render = async (props: Partial<DropdownMenuRootProps> = {}) => {
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

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.queryByText('Item')).toBeInTheDocument();
  });

  it('should close when we click the button twitce', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));
    await act(async () => await user.click(dropdownTrigger));

    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('should render children', async () => {
    const { user } = await render({
      children: <DropdownMenu.Item>Item 2</DropdownMenu.Item>,
    });
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.queryByText('Item 2')).toBeInTheDocument();
  });

  it('should close when we click outside', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(dropdownTrigger);
    });

    expect(screen.queryByText('Item')).toBeInTheDocument();

    await act(async () => {
      await user.click(document.body);
    });

    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('should close when we press ESC', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.queryByText('Item')).toBeInTheDocument();

    await act(async () => await user.keyboard('[Escape]'));

    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  });

  it('should not close if we click inisde the dropdown', async () => {
    const { user } = await render({
      children: <DropdownMenu.Item>Item 2</DropdownMenu.Item>,
    });
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.queryByText('Item')).toBeInTheDocument();

    await act(async () => await user.click(screen.getByText('Item 2')));

    expect(screen.queryByText('Item')).toBeInTheDocument();
  });

  it('should be able to render `Dropdown.Item` as a anchor element using asChild', async () => {
    const { user } = await render({
      children: (
        <DropdownMenu.Item asChild>
          <a href='/'>Anchor</a>
        </DropdownMenu.Item>
      ),
    });
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.getByText('Anchor')).toHaveAttribute('href', '/');
    expect(screen.getByText('Anchor').tagName).toBe('A');
  });

  it('Item should have role="menuitem"', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.getByText('Item')).toHaveAttribute('role', 'menuitem');
  });

  it('Group should have role="group"', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('Group should be described by heading', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => user.click(dropdownTrigger));

    expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby');
  });

  it('should focus the first item when we open the dropdown', async () => {
    const { user } = await render();
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    await vi.waitFor(() => {
      expect(document.activeElement).toBe(screen.getByText('Item'));
    });
  });
});
