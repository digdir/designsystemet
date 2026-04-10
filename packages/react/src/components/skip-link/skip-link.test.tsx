import { render, screen } from '@testing-library/react';
import { SkipLink } from './skip-link';

const href = '#main-content';
const children = 'Hopp til hovedinnhold';

describe('SkipLink', () => {
  it('Renders an anchor element with the given text and href', () => {
    render(
      <>
        <SkipLink href={href}>{children}</SkipLink>
        <main id={href?.replace('#', '')} tabIndex={-1}>
          Hovedinnhold
        </main>
      </>,
    );
    const skipLink = screen.getByRole('link');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent(children);
    expect(skipLink).toHaveAttribute('href', href);
  });

  it('Appends given className to the anchor element', () => {
    const className = 'foo';
    render(
      <SkipLink className={className} href={href}>
        {children}
      </SkipLink>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass(className);
  });
});
