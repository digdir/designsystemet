import type { Meta, StoryFn } from '@storybook/react';
import cl from 'clsx/lite';
import { useState } from 'react';

import {
  Checkbox,
  Divider,
  Heading,
  Textfield,
  Link,
  Button,
  NativeSelect,
  Search,
  Table,
  Pagination,
  Card,
  Radio,
  Tag,
  Tabs,
  Paragraph,
  Accordion,
  Switch,
} from '../src';

import classes from './showcase.module.css';

export default {
  title: 'Showcase',
} as Meta;

export const Showcase: StoryFn = () => {
  const [radioValue, setRadioValue] = useState('vanilje');
  return (
    <div className={classes.components}>
      <div className={cl(classes.help)}>
        <Heading
          size='xsmall'
          className={classes.helpHeading}
        >
          Hva kan vi hjelpe deg med?
        </Heading>
        <div className={classes.helpCards}>
          <Card color='first'>
            <Card.Header className={classes.helpHeader}>
              <Heading size='xxsmall'>Sikkerhet og drift</Heading>
            </Card.Header>
            <Card.Content className={cl(classes.helpContent)}>
              Most provide as with carried business are much better more the.
            </Card.Content>
          </Card>
          <Card color='second'>
            <Card.Header className={classes.helpHeader}>
              <Heading size='xxsmall'>Skole og utdanning</Heading>
            </Card.Header>
            <Card.Content className={cl(classes.helpContent)}>
              Most provide as with carried business are much better more the.
            </Card.Content>
          </Card>
          <Card color='third'>
            <Card.Header className={classes.helpHeader}>
              <Heading size='xxsmall'>Mat og helse</Heading>
            </Card.Header>
            <Card.Content className={cl(classes.helpContent)}>
              Most provide as with carried business are much better more the.
            </Card.Content>
          </Card>
        </div>
      </div>
      <div className={cl(classes.checkbox)}>
        <Checkbox.Group
          error=''
          legend='Handleliste'
          size='small'
        >
          <Checkbox value='epost'>En kilo poteter</Checkbox>
          <Checkbox value='telefon'>To liter Farris</Checkbox>
          <Checkbox
            value='sms'
            checked
          >
            Blomkål
          </Checkbox>
          <Divider />
          <Checkbox value='sms'>2kg smågodt</Checkbox>
          <Checkbox value='sms'>10 poser med Smash</Checkbox>
        </Checkbox.Group>
      </div>
      <div>
        <Heading
          className={cl(classes.cardTitle, classes.userTitle)}
          size='xsmall'
        >
          Opprett ny bruker
        </Heading>

        <Textfield
          label='Navn'
          size='small'
          placeholder='Ola Normann'
          className={classes.userField}
        />
        <Link
          href='#'
          className={classes.userLink}
        >
          Glemt passord?
        </Link>
        <Button
          fullWidth
          size='small'
          className={classes.userBtn}
        >
          Opprett ny bruker
        </Button>
      </div>
      <div className={cl(classes.tableContainer)}>
        <Heading
          className={classes.cardTitle}
          size='xxsmall'
        >
          Alle brukere
        </Heading>
        <div className={classes.tableHeader}>
          <div className={classes.tableAction}>
            <NativeSelect
              label=''
              size='small'
              className={classes.tableSelect}
            >
              <option value='blank'>Velg handling</option>
              <option value='everest'>Dupliser</option>
              <option value='aconcagua'>Slett</option>
              <option value='denali'>Oppdater</option>
            </NativeSelect>
            <Button
              className={classes.tableBtn}
              size='small'
            >
              Utfør
            </Button>
          </div>
          <Search
            error=''
            label='Label'
            placeholder='Søk etter bruker...'
            size='small'
            variant='simple'
            className={classes.tableSearch}
          />
        </div>
        <Table
          size='small'
          className={classes.table}
        >
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell
                onClick={function Ya() {}}
                sortable
              >
                Navn
              </Table.HeaderCell>
              <Table.HeaderCell>Epost</Table.HeaderCell>
              <Table.HeaderCell
                onClick={function Ya() {}}
                sortable
              >
                Telefon
              </Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell className={classes.tableCell}>
                <img
                  className={classes.tableImg}
                  src='/img/avatars/female1.png'
                  alt='Bilde av dame'
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
                  src='/img/avatars/male2.png'
                  alt='Bilde av mann'
                />
                Ola Nordmann
              </Table.Cell>
              <Table.Cell>ola@nordmann.no</Table.Cell>
              <Table.Cell>87654321</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Pagination
          currentPage={3}
          nextLabel='Neste'
          onChange={function Ya() {}}
          previousLabel='Forrige'
          size='small'
          totalPages={6}
        />
      </div>
      <div>
        <Radio.Group
          error=''
          legend='Hvilken iskremsmak er best?'
          size='small'
          value={radioValue}
          onChange={(e) => setRadioValue(e)}
        >
          <Radio value='vanilje'>Vanilje</Radio>
          <Radio value='jordbær'>Jordbær</Radio>
          <Radio value='sjokolade'>Sjokolade</Radio>
          <Radio value='spiser-ikke-is'>Jeg spiser ikke iskrem</Radio>
        </Radio.Group>
      </div>
      <div>
        <Heading size='xsmall'>Emner</Heading>
        <div className={classes.tagList}>
          <Tag
            color='first'
            size='small'
          >
            Data og IKT
          </Tag>
          <Tag
            color='second'
            size='small'
          >
            Mat og ernæring
          </Tag>
          <Tag
            color='third'
            size='small'
          >
            Sport og Idrett
          </Tag>
          <Tag
            color='neutral'
            size='small'
          >
            Politikk og samfunn
          </Tag>
          <Tag
            color='success'
            size='small'
          >
            Utenriks
          </Tag>
          <Tag
            color='info'
            size='small'
          >
            Helse og velvære
          </Tag>
          <Tag
            color='danger'
            size='small'
          >
            PC Gaming
          </Tag>
          <Tag
            color='warning'
            size='small'
          >
            Trening og livsstil
          </Tag>
        </div>
      </div>
      <div className={cl(classes.tabs)}>
        <Tabs
          defaultValue='value1'
          size='small'
        >
          <Tabs.List>
            <Tabs.Tab value='value1'>Min profil</Tabs.Tab>
            <Tabs.Tab value='value2'>Tjenester</Tabs.Tab>
            <Tabs.Tab value='value3'>Innstillinger</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Paragraph size='small'>
          For å kunne bli registrert i{' '}
          <Link href='#'>Frivillighetsregisteret</Link>, må organisasjonen drive
          frivillig virksomhet. Det er bare foreninger,{' '}
          <Link href='#'>stiftelser</Link> og som kan registreres. Virksomheten
          kan ikke dele ut midler til fysiske personer. Virksomheten må ha et
          styre. Virksomheten må være registrert i{' '}
          <Link href='#'>Enhetsregisteret</Link> før den kan bli registrert.
        </Paragraph>
      </div>
      <div>
        <Heading
          size='xsmall'
          className={cl(classes.footerHeading, classes.switchHeading)}
        >
          Innstillinger
        </Heading>
        <Paragraph
          size='small'
          className={classes.switchParagraph}
        >
          Her kan du justere på innstillingene dine
        </Paragraph>
        <div className={classes.switchGroup}>
          <Switch size='small'>Desktopvisning</Switch>
          <Switch
            size='small'
            checked
          >
            Tabletvisning
          </Switch>
          <Switch size='small'>Mobilvisning</Switch>
        </div>
      </div>
      <div className={cl(classes.faq)}>
        <Heading
          size='xsmall'
          className={classes.cardTitle}
        >
          Ofte stillte spørmsål
        </Heading>
        <Accordion
          color='third'
          border
          className={classes.accordion}
        >
          <Accordion.Item>
            <Accordion.Header level={3}>
              Hvem kan registrere seg i Frivillighetsregisteret?
            </Accordion.Header>
            <Accordion.Content>
              For å kunne bli registrert i Frivillighetsregisteret, må
              organisasjonen drive frivillig virksomhet. Det er bare foreninger,
              stiftelser og aksjeselskap som kan registreres. Virksomheten kan
              ikke dele ut midler til fysiske personer. Virksomheten må ha et
              styre.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header level={3}>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Accordion.Header>
            <Accordion.Content>
              Virksomheten må være registrert i Enhetsregisteret før den kan bli
              registrert i Frivillighetsregisteret. Du kan registrere i begge
              registrene samtidig i Samordnet registermelding.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header level={3}>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Accordion.Header>
            <Accordion.Content>
              Virksomheten må være registrert i Enhetsregisteret før den kan bli
              registrert i Frivillighetsregisteret. Du kan registrere i begge
              registrene samtidig i Samordnet registermelding.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};
