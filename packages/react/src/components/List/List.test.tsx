import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import type { ListProps } from './List';
import { List } from './List';
import { ListItem } from './ListItem';

const render = (props: Partial<ListProps> = {}) => {
  const allProps: ListProps = {
    children: (
      <>
        <ListItem>Test</ListItem>
      </>
    ),
    ...props,
  };
  return renderRtl(<List {...allProps} />);
};

const borderStyles: ListProps['borderStyle'][] = [undefined, 'solid'];

describe('List', () => {
  it.each(borderStyles)(
    'Renders a list with solid border when "borderStyle" is %s',
    (borderStyle) => {
      render({ borderStyle });
      const list = screen.getByRole('list');
      expect(list).toHaveClass('solid');
      expect(list).not.toHaveClass('dashed');
    },
  );

  it('Renders a list with dashed border when "borderStyle" is dashed', () => {
    render({ borderStyle: 'dashed' });
    const list = screen.getByRole('list');
    expect(list).toHaveClass('dashed');
    expect(list).not.toHaveClass('solid');
  });
});
