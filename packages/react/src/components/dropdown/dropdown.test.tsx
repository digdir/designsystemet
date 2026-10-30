import { act, render, screen } from '@testing-library/react';
import { Button } from '../button/button';
import type { DropdownProps } from './';
import { Dropdown } from './';

const Comp = ({ children, ...args }: Partial<DropdownProps>) => {
  return (
    <>
      <Button popovertarget='dropdown'>Dropdown</Button>
      <Dropdown id='dropdown' {...args}>
        <Dropdown.Heading>Links</Dropdown.Heading>
        <Dropdown.List>
          <Dropdown.Item>
            <Dropdown.Button>Item</Dropdown.Button>
          </Dropdown.Item>
          {children}
        </Dropdown.List>
      </Dropdown>
    </>
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
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should not have ds-popover class', async () => {
    render(
      <Comp data-testid='dropdown'>
        <Dropdown.Item>
          <Dropdown.Button>Item 2</Dropdown.Button>
        </Dropdown.Item>
      </Comp>,
    );

    const dropdown = screen.getByRole('button').nextElementSibling;
    expect(dropdown).not.toHaveClass('ds-popover');
    expect(dropdown).toHaveClass('ds-dropdown');
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

  /* Deprecated, remove with TriggerContext in the next major version */
  it('should open with TriggerContext', async () => {
    render(
      <Dropdown.TriggerContext>
        <Dropdown.Trigger>Dropdown</Dropdown.Trigger>
        <Dropdown>
          <Dropdown.List>
            <Dropdown.Item>
              <Dropdown.Button>Item</Dropdown.Button>
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown>
      </Dropdown.TriggerContext>,
    );

    expect(screen.getByText('Item')).not.toBeVisible();
    await act(async () =>
      screen.getByRole('button', { name: 'Dropdown' }).click(),
    );
    expect(screen.getByText('Item')).toBeVisible();
  });
});
