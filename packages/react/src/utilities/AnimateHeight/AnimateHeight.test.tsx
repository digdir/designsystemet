import { render as renderRtl, screen } from '@testing-library/react';
import { vi } from 'vitest';

import * as hooks from '../../utilities';

import type { AnimateHeightProps } from './AnimateHeight';
import { AnimateHeight } from './AnimateHeight';

const defaultProps: AnimateHeightProps = {
  open: false,
};

vi.useFakeTimers();

describe('AnimateHeight', () => {
  beforeEach(() => {
    vi.spyOn(hooks, 'useMediaQuery').mockReturnValue(false); // Set prefers-reduced-motion to false
  });

  it('Renders children', () => {
    const childTestId = 'content';
    const children = <div data-testid={childTestId} />;
    render({ children });
    expect(screen.getByTestId(childTestId)).toBeInTheDocument();
  });

  it('Appends given className to root element', () => {
    const className = 'foo';
    const { container } = render({ className });
    expect(container.firstChild).toHaveClass('ds-animate-height');
    expect(container.firstChild).toHaveClass(className);
  });

  it('Appends given style to root element', () => {
    const style = { color: 'rgb(255, 0, 0)' };
    const { container } = render({ style });
    expect(container.firstChild).toHaveStyle({ height: 0 });
    expect(container.firstChild).toHaveStyle(style);
  });

  it('Accepts additional <div> props', () => {
    const id = 'foo';
    const { container } = render({ id });
    expect(container.firstChild).toHaveAttribute('id', id);
  });

  it('Sets class to "open" when open', () => {
    const { container } = render({ open: true });
    expect(container.firstChild).toHaveClass('ds-animate-height--open');
  });

  it('Sets class to "closed" when closed', () => {
    const { container } = render({ open: false });
    expect(container.firstChild).toHaveClass('ds-animate-height--closed');
  });

  it('Sets class to "openingOrClosing" when opening and "open" when timer has run', async () => {
    const { container, rerender } = render({ open: false });
    rerender(<AnimateHeight open />);
    expect(container.firstChild).toHaveClass(
      'ds-animate-height--openingOrClosing',
    );
    await vi.waitFor(() => {
      expect(container.firstChild).not.toHaveClass(
        'ds-animate-height--openingOrClosing',
      );
    });
    expect(container.firstChild).toHaveClass('ds-animate-height--open');
  });

  it('Sets class to "openingOrClosing" when closing and "closed" when timer has run', async () => {
    const { container, rerender } = render({ open: true });
    rerender(<AnimateHeight open={false} />);
    expect(container.firstChild).toHaveClass(
      'ds-animate-height--openingOrClosing',
    );
    await vi.waitFor(() => {
      expect(container.firstChild).not.toHaveClass(
        'ds-animate-height--openingOrClosing',
      );
    });
    expect(container.firstChild).toHaveClass('ds-animate-height--closed');
  });

  it('Sets class to "open" immediately when opening and "prefers-reduced-motion" is set', () => {
    vi.spyOn(hooks, 'useMediaQuery').mockReturnValue(true);
    const { container, rerender } = render({ open: false });
    rerender(<AnimateHeight open />);
    expect(container.firstChild).toHaveClass('ds-animate-height--open');
    expect(container.firstChild).not.toHaveClass(
      'ds-animate-height--openingOrClosing',
    );
  });

  it('Sets class to "closed" immediately when closing and "prefers-reduced-motion" is set', () => {
    vi.spyOn(hooks, 'useMediaQuery').mockReturnValue(true);
    const { container, rerender } = render({ open: true });
    rerender(<AnimateHeight open={false} />);
    expect(container.firstChild).toHaveClass('ds-animate-height--closed');
    expect(container.firstChild).not.toHaveClass(
      'ds-animate-height--openingOrClosing',
    );
  });
});

const render = (props: Partial<AnimateHeightProps> = {}) =>
  renderRtl(
    <AnimateHeight
      {...defaultProps}
      {...props}
    />,
  );
