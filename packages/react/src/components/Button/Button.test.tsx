import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Success as SuccessIcon } from '@navikt/ds-icons';

import type { ButtonProps } from './Button';
import { Button, buttonSize, buttonVariant, buttonColor } from './Button';

const user = userEvent.setup();

describe('Button', () => {
  it('should render a button with primary classname when no variant is specified', () => {
    render();
    const button = screen.getByRole('button');

    expect(button.classList).toContain('primary');
    expect(button.classList).not.toContain('secondary');
    expect(button.classList).not.toContain('submit');
    expect(button.classList).not.toContain('cancel');
  });

  it.each(buttonVariant)(
    `should render a button with correct classname when variant is %s`,
    (variant) => {
      render({ variant });
      const otherVariants = buttonVariant.filter((v) => v !== variant);

      const button = screen.getByRole('button');

      expect(button.classList).toContain(variant);
      otherVariants.forEach((v) => expect(button.classList).not.toContain(v));
    },
  );

  it.each(buttonColor)(
    `should render a button with correct classname when color is %s`,
    (color) => {
      render({ color });
      const otherVariants = buttonColor.filter((c) => c !== color);

      const button = screen.getByRole('button');

      expect(button.classList).toContain(color);
      otherVariants.forEach((c) => expect(button.classList).not.toContain(c));
    },
  );

  it.each(buttonSize)(
    `should render a button with correct classname when size is %s`,
    (size) => {
      render({ size });
      const otherVariants = buttonSize.filter((s) => s !== size);

      const button = screen.getByRole('button');

      expect(button.classList).toContain(size);
      otherVariants.forEach((s) => expect(button.classList).not.toContain(s));
    },
  );

  it('should render an icon on the left side of text when given an existing iconName and no iconPlacement', () => {
    render({ icon: <SuccessIcon />, children: 'Button text' });
    const icon = screen.getByRole('img');
    expect(
      screen.getByRole('button', {
        name: /button text/i,
      }).firstChild,
    ).toEqual(icon);
  });

  it('should render an icon on the right side of text when given an existing iconName and iconPlacement is right', () => {
    render({
      icon: <SuccessIcon />,
      iconPlacement: 'right',
      children: 'Button text',
    });
    const icon = screen.getByRole('img');
    expect(
      screen.getByRole('button', {
        name: /button text/i,
      }).lastChild,
    ).toEqual(icon);
  });

  it('should render as aria-disabled when aria-disabled is true regardless of variant', () => {
    render({
      variant: 'outline',
      'aria-disabled': true,
    });

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled');
  });

  it('should render as disabled when disabled is true regardless of variant', () => {
    render({
      variant: 'outline',
      disabled: true,
    });

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const fn = jest.fn();
    render({
      variant: 'outline',
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
    const fn = jest.fn();
    render({ onClick: fn });
    await user.click(screen.getByRole('button'));
    expect(fn).toHaveBeenCalled();
  });
});

const render = (props?: ButtonProps) => renderRtl(<Button {...props} />);
