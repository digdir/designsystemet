import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('spinner', (): void => {
  it('should render with default medium size', (): void => {
    render(<Spinner title='Loading' />);
    expect(screen.getByTitle('Loading').parentElement).toHaveAttribute(
      'data-size',
      'md',
    );
  });

  it('should render with title "loading', (): void => {
    render(<Spinner title='Loading' />);
    expect(screen.getByTitle('Loading')).toBeInTheDocument();
  });
});
