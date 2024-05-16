import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ButtonProps } from './Button';
import { Button } from './Button';

const user = userEvent.setup();

describe('Button', () => {
  it('should render as aria-disabled when aria-disabled is true regardless of variant', () => {
    render({
      'aria-disabled': true,
    });

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled');
  });

  it('should render as disabled when disabled is true regardless of variant', () => {
    render({
      disabled: true,
    });

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const fn = vi.fn();
    render({
      disabled: true,
      onClick: fn,
    });

    const button = screen.getByRole('button');
    await user.click(button);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should render children as button text', () => {
    render({ children: 'different button text' });
    expect(
      screen.getByRole('button', { name: 'different button text' }),
    ).toBeInTheDocument();
  });

  it('should handle onClick event', async () => {
    const fn = vi.fn();
    render({ onClick: fn });
    await user.click(screen.getByRole('button'));
    expect(fn).toHaveBeenCalled();
  });
});

const render = (props?: ButtonProps) => renderRtl(<Button {...props} />);
