import {
  Avatar,
  Button,
  Heading,
  Select,
  EXPERIMENTAL_Suggestion as Suggestion,
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
      <Heading data-size='2xs'>{t('examples.all-users')}</Heading>
      <div className={classes.toolbar}>
        <div className={classes.toolbarLeft}>
          <Select data-size='sm' aria-label={t('examples.select-action')}>
            <Select.Option value='blank'>
              {t('examples.select-action')}
            </Select.Option>
            <Select.Option value='duplicate'>
              {t('examples.duplicate')}
            </Select.Option>
            <Select.Option value='delete'>{t('examples.delete')}</Select.Option>
            <Select.Option value='update'>{t('examples.update')}</Select.Option>
          </Select>
          <Button data-size='sm' className={classes.submitBtn}>
            {t('examples.execute')}
          </Button>
        </div>
        <div className={classes.toolbarRight}>
          <Suggestion data-size='sm'>
            <Suggestion.Input
              type='search'
              aria-label={t('examples.search')}
              placeholder={t('examples.search-user')}
            />
            <Suggestion.Clear />
          </Suggestion>
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
              <Table.HeaderCell sort='none'>
                {t('examples.name')}
              </Table.HeaderCell>
              <Table.HeaderCell>{t('examples.email')}</Table.HeaderCell>
              <Table.HeaderCell sort='none'>
                {t('examples.phone')}
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
