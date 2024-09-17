import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { DropdownMenuContextProps } from './DropdownMenuContext';

import { DropdownMenu } from '.';

const Comp = (args: Partial<DropdownMenuContextProps>) => {
  return (
    <DropdownMenu.Context {...args}>
      <DropdownMenu.Trigger>Dropdown</DropdownMenu.Trigger>
      <DropdownMenu>
        <DropdownMenu.Group heading='Links'>
          <DropdownMenu.Item>Item</DropdownMenu.Item>
          {args.children}
        </DropdownMenu.Group>
      </DropdownMenu>
    </DropdownMenu.Context>
  );
};

const render = async (props: Partial<DropdownMenuContextProps> = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(<Comp {...props} />),
  };
};

describe('Dropdown', () => {
  /* We are testing closing and opening in Popover.tests.tsx */
  it('should render children', async () => {
    const { user } = await render({
      children: <DropdownMenu.Item>Item 2</DropdownMenu.Item>,
    });
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.queryByText('Item 2')).toBeInTheDocument();
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
});
