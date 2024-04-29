import { createRef } from 'react';
import type { ComponentProps, RefObject } from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import { Link } from './Link';
import type { LinkProps } from './Link';

// Test data:
const href = 'https://designsystemet.no/';
const children = 'Gå til designsystemet';
const defaultProps: LinkProps = { href, children };

describe('Link', () => {
  it('Renders an anchor element with the given text and href', () => {
    render();
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(children);
    expect(link).toHaveAttribute('href', href);
  });

  it('Appends given className to the anchor element', () => {
    const className = 'foo';
    render({ className });
    const link = screen.getByRole('link');
    expect(link).toHaveClass('link');
    expect(link).toHaveClass(className);
  });

  it('Is not inverted by default', () => {
    render();
    const link = screen.getByRole('link');
    expect(link).not.toHaveClass('inverted');
  });

  it('Is inverted when the `inverted` property is `true`', () => {
    render({ inverted: true });
    const link = screen.getByRole('link');
    expect(link).toHaveClass('inverted');
  });

  it('Sets the ref on the anchor element if given', () => {
    const ref = createRef<HTMLAnchorElement>();
    render({}, ref);
    expect(ref.current).toBe(screen.getByRole('link'));
  });
});

const render = (
  props: Partial<ComponentProps<typeof Link>> = {},
  ref?: RefObject<HTMLAnchorElement>,
) => {
  const allProps = { ...defaultProps, ...props };
  return renderRtl(
    <Link
      {...allProps}
      ref={ref}
    >
      {allProps.children}
    </Link>,
  );
};
