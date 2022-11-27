import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Success as SuccessIcon } from '@navikt/ds-icons';

import type { ButtonProps } from './Button';

import { ButtonColor, ButtonSize, Button, ButtonVariant } from './';

const user = userEvent.setup();

describe('Button', () => {
  it('should render a button with primary classname when no variant is specified', () => {
    render({ variant: undefined });
    const button = screen.getByRole('button');

    expect(button.classList.contains('button--primary')).toBe(true);
    expect(button.classList.contains('button--secondary')).toBe(false);
    expect(button.classList.contains('button--submit')).toBe(false);
    expect(button.classList.contains('button--cancel')).toBe(false);
  });

  Object.values(ButtonVariant).forEach((variant) => {
    it(`should render a button with ${variant} classname when variant is ${variant}`, () => {
      render({ variant });
      const otherVariants = Object.values(ButtonVariant).filter(
        (v) => v !== variant,
      );

      const button = screen.getByRole('button');

      expect(button.classList.contains(`button--${variant}`)).toBe(true);
      otherVariants.forEach((v) => {
        expect(button.classList.contains(`button--${v}`)).toBe(false);
      });
    });
  });

  Object.values(ButtonColor).forEach((color) => {
    it(`should render a button with ${color} classname when color is ${color}`, () => {
      render({ color });
      const otherVariants = Object.values(ButtonColor).filter(
        (c) => c !== color,
      );

      const button = screen.getByRole('button');

      expect(button.classList.contains(`button--${color}`)).toBe(true);
      otherVariants.forEach((c) => {
        expect(button.classList.contains(`button--${c}`)).toBe(false);
      });
    });
  });

  Object.values(ButtonSize).forEach((size) => {
    it(`should render a button with ${size} classname when size is ${size}`, () => {
      render({ size });
      const otherVariants = Object.values(ButtonSize).filter((s) => s !== size);

      const button = screen.getByRole('button');

      expect(button.classList.contains(`button--${size}`)).toBe(true);
      otherVariants.forEach((s) => {
        expect(button.classList.contains(`button--${s}`)).toBe(false);
      });
    });
  });

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

  it('should render as disabled when disabled is true regardless of variant', () => {
    render({
      variant: ButtonVariant.Outline,
      color: ButtonColor.Primary,
      size: ButtonSize.Small,
      disabled: true,
    });

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const fn = jest.fn();
    render({
      variant: ButtonVariant.Outline,
      disabled: true,
      onClick: fn,
    });

    const button = screen.getByRole('button');
    user.click(button);
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

const render = (props: Partial<ButtonProps> = {}) => {
  const allProps = {
    variant: ButtonVariant.Filled,
    color: ButtonColor.Primary,
    size: ButtonSize.Small,
    ...props,
  };

  renderRtl(<Button {...allProps} />);
};
