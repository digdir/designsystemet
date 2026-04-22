import { render, screen } from '@testing-library/react';
import { List } from './';

describe('List', () => {
  it('Renders the list', () => {
    render(
      <List.Unordered>
        <List.Item>Test</List.Item>
      </List.Unordered>,
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('Renders an unordered list', () => {
    render(
      <List.Unordered>
        <List.Item>Test</List.Item>
      </List.Unordered>,
    );
    const list = document.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  it('Renders an ordered list', () => {
    render(
      <List.Ordered>
        <List.Item>Test</List.Item>
      </List.Ordered>,
    );
    const list = document.querySelector('ol');
    expect(list).toBeInTheDocument();
  });

  it('Renders the children', () => {
    render(
      <List.Unordered>
        <List.Item>Test</List.Item>
      </List.Unordered>,
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should have the passed size', () => {
    render(
      <List.Unordered data-size='lg'>
        <List.Item>Test</List.Item>
      </List.Unordered>,
    );
    expect(screen.getByRole('list')).toHaveAttribute('data-size', 'lg');
  });
});
