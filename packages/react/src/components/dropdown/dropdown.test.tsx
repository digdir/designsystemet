import { act, render, screen } from '@testing-library/react';
import { Dropdown } from './';
import type { DropdownTriggerContextProps } from './dropdown-trigger-context';

const Comp = (args: Partial<DropdownTriggerContextProps>) => {
  return (
    <Dropdown.TriggerContext {...args}>
      <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
      <Dropdown>
        <Dropdown.Heading>Links</Dropdown.Heading>
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button>Item</Dropdown.Button>
          </Dropdown.Item>
          {args.children}
        </Dropdown.List>
      </Dropdown>
    </Dropdown.TriggerContext>
  );
};

describe('Dropdown', async () => {
  /* We are testing closing and opening in Popover.tests.tsx */
  it('should render children', async () => {
    render(
      <Comp>
        <Dropdown.Item>
          <Dropdown.Button>Item 2</Dropdown.Button>
        </Dropdown.Item>
      </Comp>,
    );

    await act(async () => screen.getByRole('button').click());
    expect(screen.queryByText('Item 2')).toBeInTheDocument();
  });

  it('should be able to render `Dropdown.Button` as a anchor element using asChild', async () => {
    render(
      <Comp>
        <Dropdown.Item>
          <Dropdown.Button asChild>
            <a href='/'>Anchor</a>
          </Dropdown.Button>
        </Dropdown.Item>
      </Comp>,
    );

    await act(async () => screen.getByRole('button').click());
    expect(screen.getByText('Anchor')).toHaveAttribute('href', '/');
    expect(screen.getByText('Anchor').tagName).toBe('A');
  });
});
