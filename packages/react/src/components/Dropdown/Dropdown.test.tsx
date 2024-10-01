import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { DropdownContextProps } from './DropdownContext';

import { Dropdown } from '.';

const Comp = (args: Partial<DropdownContextProps>) => {
  return (
    <Dropdown.Context {...args}>
      <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
      <Dropdown>
        <Dropdown.Heading>Links</Dropdown.Heading>
        <Dropdown.List>
          <Dropdown.Item>Item</Dropdown.Item>
          {args.children}
        </Dropdown.List>
      </Dropdown>
    </Dropdown.Context>
  );
};

const render = async (props: Partial<DropdownContextProps> = {}) => {
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
      children: <Dropdown.Item>Item 2</Dropdown.Item>,
    });
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.queryByText('Item 2')).toBeInTheDocument();
  });

  it('should be able to render `Dropdown.Item` as a anchor element using asChild', async () => {
    const { user } = await render({
      children: (
        <Dropdown.Item asChild>
          <a href='/'>Anchor</a>
        </Dropdown.Item>
      ),
    });
    const dropdownTrigger = screen.getByRole('button');

    await act(async () => await user.click(dropdownTrigger));

    expect(screen.getByText('Anchor')).toHaveAttribute('href', '/');
    expect(screen.getByText('Anchor').tagName).toBe('A');
  });
});
