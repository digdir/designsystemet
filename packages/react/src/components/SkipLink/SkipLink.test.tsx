import React, { createRef } from 'react';
import type { RefObject } from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import { SkipLink } from './SkipLink';
import type { SkipLinkProps } from './SkipLink';

// Test data:
const href = '';
const children = 'Hopp til hovedinnhold';
const defaultProps: SkipLinkProps = { href, children };

describe('SkipLink', () => {
  it('Renders an anchor element with the given text and href', () => {
    render();
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(children);
    expect(link).toHaveAttribute('href', href);
  });

  // it('Appends given className to the anchor element', () => {
  //   const className = 'foo';
  //   render({ className });
  //   const link = screen.getByRole('link');
  //   expect(link).toHaveClass('link');
  //   expect(link).toHaveClass(className);
  // });

  // it('Sets the ref on the anchor element if given', () => {
  //   const ref = createRef<HTMLAnchorElement>();
  //   render({}, ref);
  //   expect(ref.current).toBe(screen.getByRole('link'));
  // });
});

const render = (
  props: Partial<SkipLinkProps> = {},
  ref?: RefObject<HTMLAnchorElement>,
) => {
  const allProps = { ...defaultProps, ...props };
  return renderRtl(
    <SkipLink
      {...allProps}
      ref={ref}
    >
      {allProps.children}
    </SkipLink>,
  );
};
