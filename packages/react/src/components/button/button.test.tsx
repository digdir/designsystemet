import { act, render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  beforeAll(() => {
    // Spinner for loading state uses animations, which we need to mock
    if (!document.getAnimations) {
      document.getAnimations = () => [];
    }
  });

  it('should render as aria-disabled when aria-disabled is true regardless of variant', () => {
    render(<Button aria-disabled='true' />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled');
  });

  it('should render as disabled when disabled is true regardless of variant', () => {
    render(<Button disabled />);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', async () => {
    const fn = vi.fn();
    render(<Button disabled onClick={fn} />);

    await act(async () => screen.getByRole('button').click());
    expect(fn).not.toHaveBeenCalled();
  });

  it('should render children as button text', () => {
    render(<Button>different button text</Button>);
    expect(
      screen.getByRole('button', { name: 'different button text' }),
    ).toBeInTheDocument();
  });

  it('should handle onClick event', async () => {
    const fn = vi.fn();
    render(<Button onClick={fn} />);
    await act(async () => screen.getByRole('button').click());
    expect(fn).toHaveBeenCalled();
  });

  it('should not have type attribute when asChild is true', () => {
    render(
      <Button asChild>
        <a href='#'>Link</a>
      </Button>,
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('type');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should not render children when icon-only button is loading', () => {
    render(
      <Button loading icon>
        Button text
      </Button>,
    );
    expect(screen.queryByText('Button text')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy');
  });
});
