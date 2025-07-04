import { render, screen } from '@testing-library/react';

import { Spinner } from './spinner';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('spinner', (): void => {
  it('should render with title "loading', (): void => {
    render(<Spinner aria-label='Loading' />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
