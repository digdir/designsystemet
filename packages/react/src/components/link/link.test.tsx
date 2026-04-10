import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Link } from './link';

// Test data:
const href = 'https://designsystemet.no/';
const children = 'Gå til designsystemet';

describe('Link', () => {
  it('Renders an anchor element with the given text and href', () => {
    render(<Link href={href}>{children}</Link>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(children);
    expect(link).toHaveAttribute('href', href);
  });

  it('Appends given className to the anchor element', () => {
    const className = 'foo';
    render(
      <Link className={className} href={href}>
        {children}
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('ds-link');
    expect(link).toHaveClass(className);
  });

  it('Sets the ref on the anchor element if given', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href={href}>
        {children}
      </Link>,
    );
    expect(ref.current).toBe(screen.getByRole('link'));
  });
});
