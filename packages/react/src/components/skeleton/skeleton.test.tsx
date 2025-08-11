import { render, screen } from '@testing-library/react';

import { Skeleton } from './skeleton';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('Skeleton', () => {
  it('should render skeleton', () => {
    render(<Skeleton data-testid={'skeleton-text'} />);

    expect(screen.getByTestId('skeleton-text'));
  });
});
