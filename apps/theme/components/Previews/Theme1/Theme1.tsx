import {
  Button,
  Checkbox,
  Fieldset,
  Heading,
  Link,
  Pagination,
  Paragraph,
  Radio,
  Search,
  Select,
  Switch,
  Table,
  Tag,
  Textfield,
  ValidationMessage,
  usePagination,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';

import classes from './Theme1.module.css';

export const Theme1 = () => {
  const [currentPage, setCurrentPage] = useState(3);
  const pagination = usePagination({
    currentPage,
    setCurrentPage,
    totalPages: 5,
    showPages: 5,
  });

  return (
    <div className={classes.components}>
      <div className={cl(classes.panel, classes.test)}>
        <div className={classes.panelHeader}>
          <Heading
            className={cl(classes.panelTitle, classes.userTitle)}
            data-size='2xs'
          >
            Min profil
          </Heading>
          <Button variant='tertiary' data-size='sm'>
            Large
          </Button>
        </div>

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

        <Fieldset data-size='sm' className={classes.otherInfo}>
          <Fieldset.Legend>Annen informasjon</Fieldset.Legend>
          <Checkbox
            ref={function Ms() {}}
            label='Vis meg som anomym bruker'
            name='my-group'
            onChange={function Ms() {}}
            value='epost'
            checked
          />

          <Checkbox
            ref={function Ms() {}}
            label='Send meg nyhetsbrev'
            name='my-group'
            onChange={function Ms() {}}
            value='sms'
          />
          <ValidationMessage hidden id=':r7:' />
        </Fieldset>
      </div>

      <div className={cl(classes.panel, classes.wide)}>
        <Heading className={classes.panelTitle} data-size='2xs'>
          Alle brukere
        </Heading>
        <div className={classes.tableHeader}>
          <div className={classes.tableAction}>
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
            <Search.Input aria-label='Søk' placeholder='Søk her...' />
            <Search.Clear />
          </Search>
        </div>
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
            <Table.Row>
              <Table.Cell className={classes.tableCell}>
                <img
                  className={classes.tableImg}
                  src='img/avatars/male3.png'
                  alt=''
                />
                Lise Nordmann
              </Table.Cell>
              <Table.Cell>lise@nordmann.no</Table.Cell>
              <Table.Cell>12345678</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className={classes.tableCell}>
                <img
                  className={classes.tableImg}
                  src='img/avatars/female2.png'
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
                Espen Slinde
              </Table.Cell>
              <Table.Cell>espen@nordmann.no</Table.Cell>
              <Table.Cell>43215678</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Pagination data-size='sm' className={classes.pagination}>
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

      <div className={cl(classes.panel, classes.test)}>
        <Heading className={classes.panelTitle} data-size='2xs'>
          Innstillinger
        </Heading>
        <Paragraph className={classes.panelDesc}>
          Her kan du administrere brukerene{' '}
        </Paragraph>

        <div className={classes.toggleGroup}>
          <div>
            <Heading className={classes.toggleHeading}>Visning</Heading>
            <Paragraph className={classes.toggleDesc}>
              Her kan du administrere
            </Paragraph>
          </div>
          <Switch data-size='sm' description='' label='' position='start' />
        </div>

        <div className={classes.toggleGroup}>
          <div>
            <Heading className={classes.toggleHeading}>Visning</Heading>
            <Paragraph className={classes.toggleDesc}>
              Her kan du administrere
            </Paragraph>
          </div>
          <Switch
            data-size='sm'
            description=''
            label=''
            position='start'
            checked
          />
        </div>

        <div className={classes.toggleGroup}>
          <div>
            <Heading className={classes.toggleHeading}>Visning</Heading>
            <Paragraph className={classes.toggleDesc}>
              Her kan du administrere
            </Paragraph>
          </div>
          <Switch data-size='sm' description='' label='' position='start' />
        </div>

        <Fieldset data-size='sm' className={classes.radioGroup}>
          <Fieldset.Legend>Visnigsmodus</Fieldset.Legend>

          <Radio
            ref={function Ms() {}}
            label='Vanilje'
            name='my-group'
            onChange={function Ms() {}}
            value='vanilje'
          />
          <Radio
            ref={function Ms() {}}
            label='Jordbær'
            name='my-group'
            onChange={function Ms() {}}
            value='jordbær'
            checked
          />
          <Radio
            ref={function Ms() {}}
            label='Sjokolade'
            name='my-group'
            onChange={function Ms() {}}
            value='sjokolade'
          />
          <ValidationMessage hidden id=':re:' />
        </Fieldset>
      </div>

      <div className={cl(classes.panel, classes.test)}>
        <Heading
          className={cl(classes.panelTitle, classes.userTitle)}
          data-size='2xs'
        >
          Reiste til storbyen
        </Heading>
        <img src='img/city.png' alt='' className={classes.img} />
        <div className={classes.tagGroup}>
          <Tag data-size='sm' color='brand1' className={classes.tag}>
            Musikk
          </Tag>
          <Tag data-size='sm' color='brand2' className={classes.tag}>
            Arikitektur
          </Tag>
          <Tag data-size='sm' color='brand3' className={classes.tag}>
            By
          </Tag>
        </div>
        <Heading className={classes.cardTitle}>
          In train outlines three due nor
        </Heading>
        <Paragraph className={classes.cardDesc}>
          Seven theoretically cannot retired thin over and is rewritten an I
          were desk the
        </Paragraph>
        <Link data-size='sm'>Les mer om talentet</Link>
      </div>
      <div
        className={cl(classes.panel, classes.test2, classes.darkCard)}
        data-color-scheme='dark'
      >
        <div>
          <Heading
            className={cl(classes.panelTitle, classes.darkCardTitle)}
            data-size='2xs'
          >
            Meld deg på nyhetsbrevet!
          </Heading>
          <Paragraph className={classes.darkCardDesc}>
            phase to leave an examples are up pane, completely tag by duties
            were but pointing address even at the rolled a ourselves, was
            starting parts place aslo will do a lot if the ting is really there
            and breathing.
          </Paragraph>
          <Paragraph className={classes.darkCardDesc}>
            Place copy the found with he an the an as a and that a pane, weary
            phase to leave an examples are up pane, completely tag by duties
            were but pointing.
          </Paragraph>
        </div>

        <Button data-size='sm' className={classes.darkCardBtn}>
          Meld deg på
        </Button>
      </div>
      <div className={cl(classes.panel, classes.test3)}>f</div>
    </div>
  );
};
