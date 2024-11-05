import {
  Button,
  Checkbox,
  Fieldset,
  Heading,
  Link,
  Pagination,
  Search,
  Select,
  Table,
  Textfield,
  Tooltip,
  usePagination,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';

import classes from './Components.module.css';

export const Components = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pagination = usePagination({
    currentPage,
    setCurrentPage,
    totalPages: 10,
    showPages: 7,
  });

  return (
    <div className={classes.components}>
      <div className={cl(classes.card, classes.user)}>
        <Heading
          className={cl(classes.cardTitle, classes.userTitle)}
          data-size='xs'
        >
          Min profil
        </Heading>

        <Textfield
          label='Navn'
          data-size='sm'
          placeholder='Ola Normann'
          className={classes.userField}
        />

        <Textfield
          type='email'
          label='E-post'
          data-size='sm'
          placeholder='ola@norge.no'
          className={classes.userField}
        />
        <Tooltip content='Trykk for å få hjelp' portal={false}>
          <Link href='#' className={classes.userLink}>
            Glemt passord?
          </Link>
        </Tooltip>
        <Button data-data-size='sm' className={classes.userBtn}>
          Opprett ny bruker
        </Button>
      </div>
      <div className={cl(classes.card, classes.tableContainer)}>
        <Heading className={classes.cardTitle} data-data-size='3xs'>
          Alle brukere
        </Heading>
        <div className={classes.tableHeader}>
          <div className={classes.tableAction}>
            <Select data-data-size='sm' aria-label='Velg handling'>
              <Select.Option value='blank'>Velg handling</Select.Option>
              <Select.Option value='everest'>Dupliser</Select.Option>
              <Select.Option value='aconcagua'>Slett</Select.Option>
              <Select.Option value='denali'>Oppdater</Select.Option>
            </Select>
            <Button className={classes.tableBtn} data-data-size='sm'>
              Utfør
            </Button>
          </div>
          <Search
            label='Label'
            placeholder='Søk etter bruker...'
            data-data-size='sm'
            variant='primary'
            className={classes.tableSearch}
          />
        </div>
        <Table data-data-size='sm' className={classes.table}>
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
            <Table.Row>
              <Table.Cell className={classes.tableCell}>
                <img
                  className={classes.tableImg}
                  src='img/avatars/female1.png'
                  alt=''
                />
                Lise Nordmann
              </Table.Cell>
              <Table.Cell>lise@nordmann.no</Table.Cell>
              <Table.Cell>22345678</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className={classes.tableCell}>
                <img
                  className={classes.tableImg}
                  src='img/avatars/male2.png'
                  alt=''
                />
                Ola Nordmann
              </Table.Cell>
              <Table.Cell>ola@nordmann.no</Table.Cell>
              <Table.Cell>87654321</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className={classes.tableCell}>
                <img
                  className={classes.tableImg}
                  src='img/avatars/male2.png'
                  alt=''
                />
                Ola Nordmann
              </Table.Cell>
              <Table.Cell>ola@nordmann.no</Table.Cell>
              <Table.Cell>87654321</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Pagination data-size='sm'>
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Button {...pagination.prevButtonProps}>
                Forrige
              </Pagination.Button>
            </Pagination.Item>
            {pagination.pages.map(({ itemKey, buttonProps, page }) => (
              <Pagination.Item key={itemKey}>
                <Pagination.Button {...buttonProps}>{page}</Pagination.Button>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Button {...pagination.nextButtonProps}>
                Neste
              </Pagination.Button>
            </Pagination.Item>
          </Pagination.List>
        </Pagination>
      </div>
      <div className={cl(classes.card, classes.checkbox)}>
        <Fieldset data-size='sm'>
          <Fieldset.Legend>Handleliste</Fieldset.Legend>
          <Checkbox label='En kilo poteter' value='epost' />
          <Checkbox label='To liter Farris' value='telefon' />
          <Checkbox label='Blomkål' value='sms' defaultChecked />
          <Checkbox label='Pizza' value='sms' defaultChecked />
          <Checkbox label='Tre liter lettmelk' value='sms' defaultChecked />
          <Checkbox label='2kg smågodt' value='sms' />
          <Checkbox label='10 poser med Smash' value='sms' />
        </Fieldset>
      </div>
    </div>
  );
};
