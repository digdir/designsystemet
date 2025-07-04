import { render as renderRtl, screen } from '@testing-library/react';
import type { SkipLinkProps } from './skip-link';
import { SkipLink } from './skip-link';

const href = '#main-content';
const children = 'Hopp til hovedinnhold';
const defaultProps: SkipLinkProps = { href, children };

describe('SkipLink', () => {
  it('Renders an anchor element with the given text and href', () => {
    render();
    const skipLink = screen.getByRole('link');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent(children);
    expect(skipLink).toHaveAttribute('href', href);
  });

  it('Appends given className to the anchor element', () => {
    const className = 'foo';
    render({ className });
    const link = screen.getByRole('link');
    expect(link).toHaveClass(className);
  });
});

const render = (props: Partial<SkipLinkProps> = {}) => {
  const allProps = { ...defaultProps, ...props };
  return renderRtl(
    <>
      <SkipLink {...allProps}>{allProps.children}</SkipLink>
      <main id={props.href?.replace('#', '')} tabIndex={-1}>
        Hovedinnhold
      </main>
    </>,
  );
};
