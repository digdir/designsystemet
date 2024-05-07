import { render as renderRtl, screen } from '@testing-library/react';

import type { TableHeaderCellProps } from './TableHeaderCell';

import { TableHeaderCell } from '.';

const Comp = (args: Partial<TableHeaderCellProps>) => {
  return <TableHeaderCell {...args}>Header 1</TableHeaderCell>;
};

const render = (props: Partial<TableHeaderCellProps> = {}) => {
  return renderRtl(<Comp {...props} />);
};

describe('table header cell', (): void => {
  it('should render table header cell', (): void => {
    render();
    expect(screen.getByRole('columnheader')).toBeInTheDocument();
  });

  it('should render table header cell with sort icon', (): void => {
    render({ sortable: true });
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should render table header cell with sort button', (): void => {
    render({ sortable: true });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render table header cell with sort button with aria-sort', (): void => {
    render({ sortable: true, sort: 'ascending' });
    expect(screen.getByRole('columnheader')).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });
});
