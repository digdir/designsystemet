import {
  Button,
  Input,
  Table,
  type TableHeaderCellProps,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

export const Preview = () => {
  return (
    <Table>
      <caption>Table caption</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
          <Table.HeaderCell>Header 3</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Cell 1</Table.Cell>
          <Table.Cell>Cell 2</Table.Cell>
          <Table.Cell>Cell 3</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell 4</Table.Cell>
          <Table.Cell>Cell 5</Table.Cell>
          <Table.Cell>Cell 6</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.HeaderCell>Footer 1</Table.HeaderCell>
          <Table.HeaderCell>Footer 2</Table.HeaderCell>
          <Table.HeaderCell>Footer 3</Table.HeaderCell>
        </Table.Row>
      </Table.Foot>
    </Table>
  );
};

export const Zebra = () => {
  return (
    <Table zebra>
      <caption>Antall søknader per måned</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Måned</Table.HeaderCell>
          <Table.HeaderCell>2023</Table.HeaderCell>
          <Table.HeaderCell>2024</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>Januar</Table.HeaderCell>
          <Table.Cell>1 230</Table.Cell>
          <Table.Cell>1 450</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Februar</Table.HeaderCell>
          <Table.Cell>980</Table.Cell>
          <Table.Cell>1 120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>Mars</Table.HeaderCell>
          <Table.Cell>1 150</Table.Cell>
          <Table.Cell>1 300</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const ZebraEn = () => {
  return (
    <Table zebra>
      <caption>Number of applications per month</caption>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Month</Table.HeaderCell>
          <Table.HeaderCell>2023</Table.HeaderCell>
          <Table.HeaderCell>2024</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell scope='row'>January</Table.HeaderCell>
          <Table.Cell>1 230</Table.Cell>
          <Table.Cell>1 450</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>February</Table.HeaderCell>
          <Table.Cell>980</Table.Cell>
          <Table.Cell>1 120</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell scope='row'>March</Table.HeaderCell>
          <Table.Cell>1 150</Table.Cell>
          <Table.Cell>1 300</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const Border = () => {
  return (
    <Table border>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Cell 1</Table.Cell>
          <Table.Cell>Cell 2</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const Hover = () => {
  return (
    <Table hover>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Cell 1</Table.Cell>
          <Table.Cell>Cell 2</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Cell 3</Table.Cell>
          <Table.Cell>Cell 4</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export const Sortable = () => {
  const dummyData = [
    {
      id: 1,
      navn: 'Lise Nordmann',
      epost: 'lise@nordmann.no',
      telefon: '22345678',
    },
    {
      id: 2,
      navn: 'Kari Nordmann',
      epost: 'kari@nordmann.no',
      telefon: '87654321',
    },
    {
      id: 3,
      navn: 'Ola Nordmann',
      epost: 'ola@nordmann.no',
      telefon: '32345678',
    },
    {
      id: 4,
      navn: 'Per Nordmann',
      epost: 'per@nordmann.no',
      telefon: '12345678',
    },
  ];

  const [sortField, setSortField] = useState<
    keyof (typeof dummyData)[0] | null
  >(null);
  const [sortDirection, setSortDirection] =
    useState<TableHeaderCellProps['sort']>(undefined);

  const handleSort = (field: keyof (typeof dummyData)[0]) => {
    if (sortField === field && sortDirection === 'descending') {
      setSortField(null);
      setSortDirection(undefined);
    } else {
      setSortField(field);
      setSortDirection(
        sortField === field && sortDirection === 'ascending'
          ? 'descending'
          : 'ascending',
      );
    }
  };

  const sortedData = [...dummyData].sort((a, b) => {
    if (sortField === null) return 0;
    if (a[sortField] < b[sortField])
      return sortDirection === 'ascending' ? -1 : 1;
    if (a[sortField] > b[sortField])
      return sortDirection === 'ascending' ? 1 : -1;
    return 0;
  });

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell
            sort={sortField === 'navn' ? sortDirection : 'none'}
            onClick={() => handleSort('navn')}
          >
            Navn
          </Table.HeaderCell>
          <Table.HeaderCell>Epost</Table.HeaderCell>
          <Table.HeaderCell
            sort={sortField === 'telefon' ? sortDirection : 'none'}
            onClick={() => handleSort('telefon')}
          >
            Telefon
          </Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sortedData.map((row) => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.navn}</Table.Cell>
            <Table.Cell>{row.epost}</Table.Cell>
            <Table.Cell>{row.telefon}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const SortableEn = () => {
  const dummyData = [
    {
      id: 1,
      name: 'Lise Example',
      email: 'lise@example.com',
      phone: '22345678',
    },
    {
      id: 2,
      name: 'Kari Example',
      email: 'kari@example.com',
      phone: '87654321',
    },
    {
      id: 3,
      name: 'Ola Example',
      email: 'ola@example.com',
      phone: '32345678',
    },
    {
      id: 4,
      name: 'Per Example',
      email: 'per@example.com',
      phone: '12345678',
    },
  ];

  const [sortField, setSortField] = useState<
    keyof (typeof dummyData)[0] | null
  >(null);
  const [sortDirection, setSortDirection] =
    useState<TableHeaderCellProps['sort']>(undefined);

  const handleSort = (field: keyof (typeof dummyData)[0]) => {
    if (sortField === field && sortDirection === 'descending') {
      setSortField(null);
      setSortDirection(undefined);
    } else {
      setSortField(field);
      setSortDirection(
        sortField === field && sortDirection === 'ascending'
          ? 'descending'
          : 'ascending',
      );
    }
  };

  const sortedData = [...dummyData].sort((a, b) => {
    if (sortField === null) return 0;
    if (a[sortField] < b[sortField])
      return sortDirection === 'ascending' ? -1 : 1;
    if (a[sortField] > b[sortField])
      return sortDirection === 'ascending' ? 1 : -1;
    return 0;
  });

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell
            sort={sortField === 'name' ? sortDirection : 'none'}
            onClick={() => handleSort('name')}
          >
            Name
          </Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell
            sort={sortField === 'phone' ? sortDirection : 'none'}
            onClick={() => handleSort('phone')}
          >
            Phone
          </Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sortedData.map((row) => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.email}</Table.Cell>
            <Table.Cell>{row.phone}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const FixedTable = () => {
  const rows = Array.from({ length: 3 }, (_, i) => i + 1);
  return (
    <Table
      style={{
        tableLayout: 'fixed',
      }}
    >
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Header 1</Table.HeaderCell>
          <Table.HeaderCell>Header 2</Table.HeaderCell>
          <Table.HeaderCell>Header 3</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row}>
            <Table.Cell>{`Cell ${row}1`}</Table.Cell>
            <Table.Cell>{`Cell ${row}2`}</Table.Cell>
            <Table.Cell>{`Cell ${row}3`}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export const Numbers = () => (
  <Table
    style={{
      tableLayout: 'fixed',
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    <caption>Antall søknader per måned</caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col'>Måned</Table.HeaderCell>
        <Table.HeaderCell scope='col' style={{ textAlign: 'right' }}>
          2023
        </Table.HeaderCell>
        <Table.HeaderCell scope='col' style={{ textAlign: 'right' }}>
          2024
        </Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.HeaderCell scope='row'>Januar</Table.HeaderCell>
        <Table.Cell style={{ textAlign: 'right' }}>1 230</Table.Cell>
        <Table.Cell style={{ textAlign: 'right' }}>1 450</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.HeaderCell scope='row'>Februar</Table.HeaderCell>
        <Table.Cell style={{ textAlign: 'right' }}>980</Table.Cell>
        <Table.Cell style={{ textAlign: 'right' }}>1 120</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.HeaderCell scope='row'>Mars</Table.HeaderCell>
        <Table.Cell style={{ textAlign: 'right' }}>1 150</Table.Cell>
        <Table.Cell style={{ textAlign: 'right' }}>1 300</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

export const NumbersEn = () => (
  <Table
    style={{
      tableLayout: 'fixed',
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    <caption>Number of applications per month</caption>
    <Table.Head>
      <Table.Row>
        <Table.HeaderCell scope='col'>Month</Table.HeaderCell>
        <Table.HeaderCell scope='col' style={{ textAlign: 'right' }}>
          2023
        </Table.HeaderCell>
        <Table.HeaderCell scope='col' style={{ textAlign: 'right' }}>
          2024
        </Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      <Table.Row>
        <Table.HeaderCell scope='row'>January</Table.HeaderCell>
        <Table.Cell style={{ textAlign: 'right' }}>1 230</Table.Cell>
        <Table.Cell style={{ textAlign: 'right' }}>1 450</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.HeaderCell scope='row'>February</Table.HeaderCell>
        <Table.Cell style={{ textAlign: 'right' }}>980</Table.Cell>
        <Table.Cell style={{ textAlign: 'right' }}>1 120</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.HeaderCell scope='row'>March</Table.HeaderCell>
        <Table.Cell style={{ textAlign: 'right' }}>1 150</Table.Cell>
        <Table.Cell style={{ textAlign: 'right' }}>1 300</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);

export const Clickable = () => (
  <Table>
    <caption>Table caption</caption>
    <Table.Body>
      <Table.Row data-clickdelegatefor='my-button'>
        <Table.Cell>
          <Button id='my-button' onClick={() => alert('clicked cell 1')}>
            Cell 1
          </Button>
        </Table.Cell>
        <Table.Cell>Cell 2</Table.Cell>
        <Table.Cell>Cell 3</Table.Cell>
      </Table.Row>
      <Table.Row data-clickdelegatefor='my-checkbox'>
        <Table.Cell>
          <Input type='checkbox' aria-label='check me' id='my-checkbox' /> Cell
          4
        </Table.Cell>
        <Table.Cell>Cell 5</Table.Cell>
        <Table.Cell>Cell 6</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
);
