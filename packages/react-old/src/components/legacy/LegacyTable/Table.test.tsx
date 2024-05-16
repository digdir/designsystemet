import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { TableProps } from './Table';
import { Table } from './Table';
import { TableBody } from './TableBody';
import { TableCell } from './TableCell';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface TestRow {
  fruit: string;
}

const render = (props: Partial<TableProps<TestRow>> = {}) => {
  const allProps: TableProps<TestRow> = {
    children: (
      <>
        <TableHeader>
          <TableRow>
            <TableCell>Frukt</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow rowData={{ fruit: 'apple' }}>
            <TableCell>Apple</TableCell>
          </TableRow>
          <TableRow rowData={{ fruit: 'orange' }}>
            <TableCell>Orange</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
    onChange: vi.fn(),
    selectRows: true,
    selectedValue: { fruit: '' },
    ...props,
  };
  renderRtl(<Table {...allProps} />);
};

const user = userEvent.setup();

describe('Table', () => {
  it('Calls onChange with correct selectedValue when TableRow is clicked and selectRows is true', async () => {
    const onChange = vi.fn();
    render({ onChange, selectRows: true });
    await user.click(screen.getByText('Apple'));
    expect(onChange).toHaveBeenCalledWith({
      selectedValue: { fruit: 'apple' },
    });
  });

  it('Does not call onChange when when selectRows is false and TableRow is clicked', async () => {
    const onChange = vi.fn();
    render({ onChange, selectRows: false });
    await user.click(screen.getByText('Apple'));
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
