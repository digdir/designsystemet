import { render, screen } from '@testing-library/react';

import { Skeleton } from '..';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('Skeleton.Text', () => {
  it('should render skeleton', () => {
    render(<Skeleton.Text data-testid={'skeleton-text'} />);

    expect(screen.getByTestId('skeleton-text'));
  });
});
