import { render as renderRtl, screen } from '@testing-library/react';

import type { ListUnorderedProps } from './List';

import { List } from '.';
import { Heading } from '../Typography/Heading';

const render = (props: Partial<ListUnorderedProps> = {}) => {
  const allProps: ListUnorderedProps = {
    children: <List.Item>Test</List.Item>,
    ...props,
  };
  return renderRtl(<List.Unordered {...allProps} />);
};

describe('List', () => {
  it('Renders the list', () => {
    render();

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('Renders an unordered list', () => {
    render();
    const list = document.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  it('Renders an ordered list', () => {
    renderRtl(
      <List.Ordered>
        <List.Item>Test</List.Item>
      </List.Ordered>,
    );
    const list = document.querySelector('ol');
    expect(list).toBeInTheDocument();
  });

  it('Renders the children', () => {
    render();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should have the passed size', () => {
    render({ size: 'lg' });
    expect(screen.getByRole('list')).toHaveAttribute('data-size', 'lg');
  });

  it('should have aria-labelledby when previous element is heading', () => {
    renderRtl(
      <>
        <Heading>Title</Heading>
        <List.Unordered />
      </>,
    );
    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-labelledby',
      screen.getByRole('heading').getAttribute('id'),
    );
  });
  it('should have aria-labelledby when heading is with passed id', () => {
    renderRtl(
      <>
        <Heading id='passedId'>Title</Heading>
        <List.Unordered />
      </>,
    );
    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-labelledby',
      'passedId',
    );
  });
  it('should not have aria-labelledby when heading is missing', () => {
    render();
    expect(screen.getByRole('list')).not.toHaveAttribute('aria-labelledby');
  });
  it('should not have aria-labelledby when list has aria-label', () => {
    renderRtl(
      <>
        <Heading>Title</Heading>
        <List.Unordered aria-label='Custom list label' />
      </>,
    );
    expect(screen.getByRole('list')).not.toHaveAttribute('aria-labelledby');
  });
  it('should respect exsisting aria-labelledby', () => {
    renderRtl(
      <>
        <Heading level={2} id='main-title'>
          Main title
        </Heading>
        <Heading level={3}>Subtitle</Heading>
        <List.Unordered aria-labelledby='main-title' />
      </>,
    );
    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-labelledby',
      'main-title',
    );
  });
});
