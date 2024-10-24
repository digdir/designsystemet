import {
  Accordion,
  Alert,
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  Dropdown,
  Fieldset,
  Heading,
  HelpText,
  Label,
  Link,
  Pagination,
  Paragraph,
  Radio,
  Search,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
  Textfield,
  ToggleGroup,
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
      <div className={cl(classes.card, classes.checkbox)}>
        <Fieldset legend='Handleliste' size='sm'>
          <Checkbox label='En kilo poteter' value='epost' />
          <Checkbox label='To liter Farris' value='telefon' />
          <Checkbox label='Blomkål' value='sms' defaultChecked />
          <Checkbox label='Pizza' value='sms' defaultChecked />
          <Checkbox label='Tre liter lettmelk' value='sms' defaultChecked />
          <Checkbox label='2kg smågodt' value='sms' />
          <Checkbox label='10 poser med Smash' value='sms' />
        </Fieldset>
      </div>
      <div className={cl(classes.card, classes.user)}>
        <Heading className={cl(classes.cardTitle, classes.userTitle)} size='xs'>
          Opprett ny bruker
        </Heading>

        <Textfield
          label='Navn'
          size='sm'
          placeholder='Ola Normann'
          className={classes.userField}
        />
        <Textfield
          type='email'
          label='E-post'
          size='sm'
          placeholder='ola@norge.no'
          className={classes.userField}
        />
        <Tooltip content='Trykk for å få hjelp' portal={false}>
          <Link href='#' className={classes.userLink}>
            Glemt passord?
          </Link>
        </Tooltip>
        <Button size='sm' className={classes.userBtn}>
          Opprett ny bruker
        </Button>
      </div>
      <div className={cl(classes.card, classes.tableContainer)}>
        <Heading className={classes.cardTitle} size='2xs'>
          Alle brukere
        </Heading>
        <div className={classes.tableHeader}>
          <div className={classes.tableAction}>
            <Select size='sm' aria-label='Velg handling'>
              <Select.Option value='blank'>Velg handling</Select.Option>
              <Select.Option value='everest'>Dupliser</Select.Option>
              <Select.Option value='aconcagua'>Slett</Select.Option>
              <Select.Option value='denali'>Oppdater</Select.Option>
            </Select>
            <Button className={classes.tableBtn} size='sm'>
              Utfør
            </Button>
          </div>
          <Search
            label='Label'
            placeholder='Søk etter bruker...'
            size='sm'
            variant='primary'
            className={classes.tableSearch}
          />
        </div>
        <Table size='sm' border className={classes.table}>
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
          </Table.Body>
        </Table>
        <Pagination size='sm'>
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
      <div className={cl(classes.card, classes.help)}>
        <Heading size='xs' className={classes.helpHeading}>
          Hva kan vi hjelpe deg med?
        </Heading>
        <div className={classes.helpCards}>
          <Card color='brand1'>
            <Heading size='2xs' className={classes.helpCardHeading}>
              Sikkerhet og drift
            </Heading>
            <Paragraph>
              Most provide as with carried business are much better more the.
            </Paragraph>
          </Card>
          <Card color='brand2'>
            <Heading size='2xs' className={classes.helpCardHeading}>
              Skole og utdanning
            </Heading>
            <Paragraph>
              Most provide as with carried business are much better more the.
            </Paragraph>
          </Card>
          <Card color='brand3'>
            <Heading size='2xs' className={classes.helpCardHeading}>
              <a href='#preview'>Mat og helse</a>
            </Heading>
            <Paragraph>
              Lenke til artikkel om mat og helse, der du kan lese mer om alt.
            </Paragraph>
          </Card>
        </div>
      </div>
      <div className={cl(classes.card, classes.radio)}>
        <Fieldset
          legend='Hvilken iskremsmak er best?'
          description='Velg din favorittsmak'
          size='sm'
        >
          <Radio label='Vanile' value='vanilje' />
          <Radio label='Jordbær' value='jordbær' defaultChecked />
          <Radio label='Sjokolade' value='sjokolade' />
          <Radio label='Jeg spiser ikke iskrem' value='spiser-ikke-is' />
        </Fieldset>
      </div>
      <div className={cl(classes.card, classes.tag)}>
        <Heading size='xs' className={classes.tagHeading}>
          Emner
        </Heading>
        <div className={classes.tagList}>
          <Tag color='brand1' size='sm'>
            Data og IKT
          </Tag>
          <Tag color='brand2' size='sm'>
            Mat og ernæring
          </Tag>
          <Tag color='brand3' size='sm'>
            Sport og Idrett
          </Tag>
          <Tag color='neutral' size='sm'>
            Politikk og samfunn
          </Tag>
          <Tag color='success' size='sm'>
            Utenriks
          </Tag>
          <Tag color='info' size='sm'>
            Helse og velvære
          </Tag>
          <Tag color='danger' size='sm'>
            PC Gaming
          </Tag>
          <Tag color='warning' size='sm'>
            Trening og livsstil
          </Tag>
        </div>
      </div>
      <div className={cl(classes.card, classes.switches)}>
        <Fieldset
          legend='Instillinger'
          description='Her kan du justere på innstillingene dine'
          size='sm'
          className={classes.SwitchContainer}
        >
          <Switch defaultChecked>TV-visning</Switch>
          <Switch>Desktopvisning</Switch>
          <Switch defaultChecked readOnly>
            Tabletvisning
          </Switch>
          <Switch disabled>Mobilvisning</Switch>
        </Fieldset>
      </div>
      <div className={cl(classes.card, classes.toggleGroup)}>
        <Heading size='xs'>Hvor er du fra?</Heading>
        <Paragraph size='sm'>Svar under så finner vi flyreise</Paragraph>
        <div className={classes.toggleCombo}>
          <ToggleGroup defaultValue='norway' size='sm'>
            <ToggleGroup.Item value='norway'>Norge</ToggleGroup.Item>
            <ToggleGroup.Item value='sweden'>Sverige</ToggleGroup.Item>
            <ToggleGroup.Item value='utlandet'>Utlandet</ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <Heading size='xs' className={classes.chipsHeading}>
          Filtrer på språk
        </Heading>
        <div className={classes.chips}>
          <Chip.Radio name='language' size='md' defaultChecked>
            Bokmål
          </Chip.Radio>
          <Chip.Radio name='language' size='md'>
            Nynorsk
          </Chip.Radio>
          <Chip.Radio name='language' size='md'>
            Engelsk
          </Chip.Radio>
        </div>
      </div>
      <div className={cl(classes.card, classes.comboBox)}>
        <Heading size='xs' className={classes.comboHeading}>
          Hvor skal du reise?
        </Heading>
        <Combobox label='Destinasjon' size='sm' portal={false} multiple>
          <Combobox.Empty>Fant ingen treff</Combobox.Empty>
          <Combobox.Option value='leikanger'>Leikanger</Combobox.Option>
          <Combobox.Option value='oslo'>Oslo</Combobox.Option>
          <Combobox.Option value='bronnoysund'>Brønnøysund</Combobox.Option>
          <Combobox.Option value='stavanger'>Stavanger</Combobox.Option>
          <Combobox.Option value='trondheim'>Trondheim</Combobox.Option>
          <Combobox.Option value='tromso'>Tromsø</Combobox.Option>
          <Combobox.Option value='bergen'>Bergen</Combobox.Option>
          <Combobox.Option value='moirana'>Mo i Rana</Combobox.Option>
        </Combobox>
        <Label className={classes.textareaLabel} htmlFor='my-textarea'>
          Ekstra informasjon
        </Label>
        <Textarea
          className={classes.textarea}
          cols={100}
          id='my-textarea'
          rows={4}
          size='sm'
        />
      </div>
      <div className={cl(classes.card, classes.tabs)}>
        <Tabs defaultValue='value1' size='sm'>
          <Tabs.List>
            <Tabs.Tab value='value1'>Min profil</Tabs.Tab>
            <Tabs.Tab value='value2'>Tjenester</Tabs.Tab>
            <Tabs.Tab value='value3'>Innstillinger</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Paragraph size='sm'>
          For å kunne bli registrert i{' '}
          <Link href='#' color='neutral'>
            Frivillighetsregisteret
          </Link>
          , må organisasjonen drive frivillig virksomhet. Det er bare
          foreninger,{' '}
          <Link href='#' color='neutral'>
            stiftelser
          </Link>{' '}
          og som kan registreres. Virksomheten kan ikke dele ut midler til
          fysiske personer. Virksomheten må ha et styre. Virksomheten må være
          registrert i{' '}
          <Link href='#' color='neutral'>
            Enhetsregisteret
          </Link>{' '}
          før den kan bli registrert.
        </Paragraph>
      </div>
      <div className={cl(classes.card, classes.faq)}>
        <Heading size='xs' className={classes.cardTitle}>
          Ofte stillte spørsmål
        </Heading>
        <Accordion color='brand3' border className={classes.accordion}>
          <Accordion.Item>
            <Accordion.Heading>
              Hvem kan registrere seg i Frivillighetsregisteret?
            </Accordion.Heading>
            <Accordion.Content>
              <Paragraph size='sm'>
                For å kunne bli registrert i Frivillighetsregisteret, må
                organisasjonen drive frivillig virksomhet. Det er bare
                foreninger, stiftelser og aksjeselskap som kan registreres.
                Virksomheten kan ikke dele ut midler til fysiske personer.
                Virksomheten må ha et styre.
              </Paragraph>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Accordion.Heading>
            <Accordion.Content>
              <Paragraph size='sm'>
                Virksomheten må være registrert i Enhetsregisteret før den kan
                bli registrert i Frivillighetsregisteret. Du kan registrere i
                begge registrene samtidig i Samordnet registermelding.
              </Paragraph>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Accordion.Heading>
            <Accordion.Content>
              <Paragraph size='sm'>
                Virksomheten må være registrert i Enhetsregisteret før den kan
                bli registrert i Frivillighetsregisteret. Du kan registrere i
                begge registrene samtidig i Samordnet registermelding.
              </Paragraph>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className={cl(classes.card, classes.alert)}>
        <Alert color='info' size='sm'>
          Dette er informasjon som du bør lese for å forstå hva som skjer
        </Alert>
        <Alert color='warning' size='sm'>
          Dette er en advarsel om at noe kan gå galt hvis du ikke følger med
        </Alert>
        <Alert color='danger' size='sm'>
          Dette er en melding om at noe har gått galt og du bør gjøre noe med
          det
        </Alert>
        <Alert color='success' size='sm'>
          Dette er en melding om at noe har gått bra og du kan fortsette
        </Alert>
      </div>
      <div className={cl(classes.card, classes.dropdown)}>
        <Dropdown.Context>
          <Dropdown.Trigger size='sm'>Velg språk</Dropdown.Trigger>
          <Dropdown placement='top' size='sm'>
            <Dropdown.Item>Norsk</Dropdown.Item>
            <Dropdown.Item>Engelsk</Dropdown.Item>
            <Dropdown.Item>Spansk</Dropdown.Item>
            <Dropdown.Item>Fransk</Dropdown.Item>
          </Dropdown>
          <HelpText aria-label='Du har ikke valgt språk'>
            Velg språk for å endre innholdet på siden
          </HelpText>
        </Dropdown.Context>
      </div>
      <div className={cl(classes.card, classes.loaders)}>
        <div className={classes.loadersRest}>
          <Skeleton variant='circle' width='70px' height='70px' />
          <Skeleton variant='rectangle' height='70px' width='100px' />
        </div>
        <Skeleton variant='text' />
        <Skeleton variant='text' />
        <div>
          <Spinner title='laster innhold' size='md' />
          <Spinner title='laster innhold' size='md' color='accent' />
        </div>
      </div>
    </div>
  );
};
