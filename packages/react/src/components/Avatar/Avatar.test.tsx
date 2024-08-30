import { render, screen } from '@testing-library/react';
import { Avatar } from './';

describe('Avatar', () => {
  it('should render correctly with default props', () => {
    render(<Avatar aria-label='ola' />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('data-ds-size', 'md');
    expect(screen.getByRole('img')).toHaveAttribute(
      'data-ds-variant',
      'circle',
    );
    expect(screen.getByRole('img')).toHaveAttribute('data-ds-color', 'accent');
  });

  it('should render correctly with custom props', () => {
    render(<Avatar size='lg' variant='square' aria-label='ola' />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('data-ds-size', 'lg');
    expect(screen.getByRole('img')).toHaveAttribute(
      'data-ds-variant',
      'square',
    );
  });

  it('should render initials when name is set', () => {
    render(<Avatar aria-label='Ola Nordmann'>ON</Avatar>);
    expect(screen.getByText('ON')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Avatar aria-label='Ola Nordmann'>
        <img src='' alt='ola nordmann' data-testid='child-image' />
      </Avatar>,
    );
    /* look for image with correct id */
    expect(screen.getByTestId('child-image')).toBeInTheDocument();
  });

  it('children should have aria-hidden', () => {
    render(
      <Avatar aria-label='Ola Nordmann'>
        <img src='' alt='ola nordmann' data-testid='child-image' />
      </Avatar>,
    );
    expect(screen.getByTestId('child-image')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
