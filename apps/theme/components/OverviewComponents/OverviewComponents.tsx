import {
  Avatar,
  Button,
  Heading,
  Link,
  Paragraph,
  Search,
  Select,
  Table,
  Tag,
  Textfield,
} from '@digdir/designsystemet-react';
import { forwardRef } from 'react';
import classes from './OverviewComponents.module.css';
import { SettingsCard } from './SettingsCard/SettingsCard';

const users = [
  {
    name: 'Ola Normann',
    role: 'Designer',
    avatar: 'img/avatars/male2.png',
  },
  {
    name: 'Kari Slotsveen',
    role: 'Frontend',
    avatar: 'img/avatars/female2.png',
  },
  {
    name: 'Marcus Viken',
    role: 'Backend',
    avatar: 'img/avatars/male3.png',
  },
];

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

export const OverviewComponents = forwardRef<HTMLDivElement>(
  function OverviewComponents(_, ref) {
    return (
      <div className={classes.container} ref={ref}>
        <div className={classes.inner}>
          <div className={classes.card}>
            <Heading data-size='2xs'>Logg inn i portalen</Heading>
            <Textfield placeholder='Ola Normann' label='Navn' data-size='sm' />
            <Textfield placeholder='********' label='Passord' data-size='sm' />
            <Link href='#' data-size='sm'>
              Glemt passord?
            </Link>

            <Button data-size='sm' className={classes.btn}>
              Logg inn
            </Button>
          </div>
          <div
            className={classes.card}
            style={{
              flexGrow: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Select data-size='sm' aria-label='Velg handling'>
                <Select.Option value='blank'>Velg handling</Select.Option>
                <Select.Option value='everest'>Dupliser</Select.Option>
                <Select.Option value='aconcagua'>Slett</Select.Option>
                <Select.Option value='denali'>Oppdater</Select.Option>
              </Select>
              <Button className={classes.tableBtn} data-size='sm'>
                Utfør
              </Button>
            </div>
            <Search className={classes.tableSearch} data-size='sm'>
              <Search.Input
                aria-label='Søk'
                placeholder='Søk etter brukere her...'
              />
              <Search.Clear />
            </Search>
            <Table data-size='sm' className={classes.table}>
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
                        <Avatar aria-label={user.name} variant='square'>
                          <img
                            className={classes.tableImg}
                            src={user.avatar}
                            alt=''
                          />
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
          <div className={classes.card} data-size='sm'>
            <SettingsCard />
          </div>
          <div className={classes.card}>
            <img className={classes.img} src='img/city.png' alt='' />
            <div className={classes.imgText}>
              <div className={classes.tags} data-size='sm'>
                <Tag color='brand1'>Sport</Tag>
                <Tag color='brand2'>Nyheter</Tag>
                <Tag color='brand3'>Innenriks</Tag>
              </div>
              <Heading data-size='2xs' className={classes.imgTitle}>
                Reiste alene til storbyen
              </Heading>
              <Paragraph data-size='sm' className={classes.imgDesc}>
                Mona kvist ville finne drømmen i New York City
              </Paragraph>
            </div>
          </div>
          <div className={classes.card} style={{ flexGrow: 1 }}>
            <Heading data-size='2xs'>Folk du kanskje kjenner</Heading>
            <div className={classes.users}>
              {users.map((user) => {
                return (
                  <div className={classes.user} key={user.role}>
                    <Avatar aria-label={user.name} variant='square'>
                      <img src='img/avatars/male2.png' alt='' />
                    </Avatar>
                    <div className={classes.userText}>
                      <Tag data-size='sm'>Designer</Tag>
                      <div>Ola Normann</div>
                    </div>
                    <Button
                      data-size='sm'
                      variant='secondary'
                      style={{ marginLeft: 'auto' }}
                    >
                      Følg
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
