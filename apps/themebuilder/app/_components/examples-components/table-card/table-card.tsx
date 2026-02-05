import {
  Avatar,
  Button,
  Heading,
  Search,
  Select,
  Table,
} from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import classes from './table-card.module.css';

const tableData = [
  {
    name: 'Ola Normann',
    avatar: '/img/avatars/male2.png',
    email: 'ola@example.no',
    phone: '12345678',
  },
  {
    name: 'Kari Slotsveen',
    avatar: '/img/avatars/female2.png',
    email: 'kari@example.no',
    phone: '12345678',
  },
  {
    name: 'Marcus Viken',
    avatar: '/img/avatars/male3.png',
    email: 'marcus@example.no',
    phone: '12345678',
  },
];

export const TableCard = () => {
  const { t } = useTranslation();
  return (
    <>
      <Heading data-size='2xs'>{t('overview.all-users')}</Heading>
      <div className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          <Select data-size='sm' aria-label={t('overview.select-action')}>
            <Select.Option value='blank'>
              {t('overview.select-action')}
            </Select.Option>
            <Select.Option value='everest'>
              {t('overview.duplicate')}
            </Select.Option>
            <Select.Option value='aconcagua'>
              {t('overview.delete')}
            </Select.Option>
            <Select.Option value='denali'>{t('overview.update')}</Select.Option>
          </Select>
          <Button data-size='sm' className={classes.submitBtn}>
            {t('overview.execute')}
          </Button>
        </div>
        <div className={classes.toolbarRight}>
          <Search data-size='sm'>
            <Search.Input
              aria-label={t('overview.search')}
              placeholder={t('overview.search-user')}
            />
            <Search.Clear />
          </Search>
        </div>
      </div>
      <div
        style={{
          overflowX: 'auto',
        }}
      >
        {' '}
        <Table data-size='sm' border data-color='neutral'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell onClick={function Ya() {}} sort='none'>
                {t('overview.name')}
              </Table.HeaderCell>
              <Table.HeaderCell>{t('overview.email')}</Table.HeaderCell>
              <Table.HeaderCell onClick={function Ya() {}} sort='none'>
                {t('overview.phone')}
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
