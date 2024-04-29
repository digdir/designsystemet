import { render as renderRtl, screen } from '@testing-library/react';

import type { HelpTextIconProps } from './HelpTextIcon';
import { HelpTextIcon } from './HelpTextIcon';

// Test data:
const className = 'test-class';
const defaultProps: HelpTextIconProps = {
  className,
  openState: true,
};

describe('HelpTextIcon', () => {
  it('Renders an icon', () => {
    render();
    expect(getIcon()).toBeInTheDocument();
  });

  it('Renders with correct path when the `filled` property is `true`', () => {
    render({ filled: true });
    const path = getIcon().firstChild;
    expect(path).toHaveAttribute(
      'd',
      expect.stringMatching(/^M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 16/),
    );
  });

  it('Renders with correct path when the `filled` property is `false`', () => {
    render({ filled: false });
    const path = getIcon().firstChild;
    expect(path).toHaveAttribute(
      'd',
      expect.stringMatching(/^M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C/),
    );
  });

  it('Renders with given className', () => {
    render({ className });
    expect(getIcon()).toHaveClass(className);
  });

  it('Renders with data-state="open" when `openState` is `true`', () => {
    render({ openState: true });
    expect(getIcon()).toHaveAttribute('data-state', 'open');
  });

  it('Renders with data-state="closed" when `openState` is `false`', () => {
    render({ openState: false });
    expect(getIcon()).toHaveAttribute('data-state', 'closed');
  });

  const getIcon = () => screen.getByRole('img', { hidden: true });
});

const render = (props: Partial<HelpTextIconProps> = {}) =>
  renderRtl(
    <HelpTextIcon
      {...defaultProps}
      {...props}
    />,
  );
