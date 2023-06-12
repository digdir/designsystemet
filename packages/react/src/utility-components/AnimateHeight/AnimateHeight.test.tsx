import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import type { AnimateHeightProps } from './AnimateHeight';
import { AnimateHeight } from './AnimateHeight';

const defaultProps: AnimateHeightProps = {
  open: false,
};

describe('AnimateHeight', () => {
  it('Renders children', () => {
    const childTestId = 'content';
    const children = <div data-testid={childTestId} />;
    render({ children });
    expect(screen.getByTestId(childTestId)).toBeInTheDocument();
  });

  it('Appends given className to root element', () => {
    const className = 'foo';
    const { container } = render({ className });
    expect(container.firstChild).toHaveClass('root');
    expect(container.firstChild).toHaveClass(className);
  });

  it('Appends given style to root element', () => {
    const style = { color: 'red' };
    const { container } = render({ style });
    expect(container.firstChild).toHaveStyle({ height: 0 });
    expect(container.firstChild).toHaveStyle(style);
  });

  it('Accepts additional <div> props', () => {
    const id = 'foo';
    const { container } = render({ id });
    expect(container.firstChild).toHaveAttribute('id', id);
  });

  it('Sets content class to "open" when open', () => {
    const { container } = render({ open: true });
    expect(container.firstChild?.firstChild).toHaveClass('open');
  });

  it('Sets content class to "closed" when closed', () => {
    const { container } = render({ open: false });
    expect(container.firstChild?.firstChild).toHaveClass('closed');
  });
});

const render = (props: Partial<AnimateHeightProps> = {}) =>
  renderRtl(
    <AnimateHeight
      {...defaultProps}
      {...props}
    />,
  );
