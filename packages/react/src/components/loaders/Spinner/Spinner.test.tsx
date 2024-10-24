import { render, screen } from '@testing-library/react';

import { Spinner } from './Spinner';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('spinner', (): void => {
  it('should render with title "loading', (): void => {
    render(<Spinner title='Loading' />);
    expect(screen.getByTitle('Loading')).toBeInTheDocument();
  });
});
