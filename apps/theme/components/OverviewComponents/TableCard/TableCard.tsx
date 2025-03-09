import {
  Avatar,
  Button,
  Heading,
  Search,
  Select,
  Table,
} from '@digdir/designsystemet-react';
import classes from './TableCard.module.css';
const tableData = [
  {
    name: 'Ola Normann',
    avatar: 'img/avatars/male2.png',
    email: 'ola@example.no',
    phone: '12345678',
  },
  {
    name: 'Kari Slotsveen',
    avatar: 'img/avatars/female2.png',
    email: 'kari@example.no',
    phone: '12345678',
  },
  {
    name: 'Marcus Viken',
    avatar: 'img/avatars/male3.png',
    email: 'marcus@example.no',
    phone: '12345678',
  },
];

export const TableCard = () => {
  return (
    <>
      <Heading data-size='2xs'>Alle brukere</Heading>
      <div className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          <Select data-size='sm' aria-label='Velg handling'>
            <Select.Option value='blank'>Velg handling</Select.Option>
            <Select.Option value='everest'>Dupliser</Select.Option>
            <Select.Option value='aconcagua'>Slett</Select.Option>
            <Select.Option value='denali'>Oppdater</Select.Option>
          </Select>
          <Button data-size='sm' className={classes.submitBtn}>
            Utfør
          </Button>
        </div>
        <div className={classes.toolbarRight}>
          <Search data-size='sm'>
            <Search.Input aria-label='Søk' placeholder='Søk etter bruker' />
            <Search.Clear />
          </Search>
        </div>
      </div>
      <div
        style={{
          overflowX: 'auto',
        }}
      >
        <Table data-size='sm' border data-color='neutral'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell onClick={function Ya() {}} sort='none'>
                Navn
              </Table.HeaderCell>
              <Table.HeaderCell>Epost</Table.HeaderCell>
              <Table.HeaderCell onClick={function Ya() {}} sort='none'>
                Telefon
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {tableData.map((user) => {
              return (
                <Table.Row key={user.name}>
                  <Table.Cell
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <Avatar
                      aria-label={user.name}
                      variant='circle'
                      className={classes.avatar}
                    >
                      <img src={user.avatar} alt='' />
                    </Avatar>
                    {user.name}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.phone}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};
