import {
  Accordion,
  Alert,
  Button,
  Card,
  Checkbox,
  Chip,
  Combobox,
  DropdownMenu,
  Fieldset,
  Heading,
  HelpText,
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
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';

import classes from './Components.module.css';

export const Components = () => {
  const [radioValue, setRadioValue] = useState('vanilje');
  return (
    <div className={classes.components}>
      <div className={cl(classes.card, classes.checkbox)}>
        <Checkbox.Group error='' legend='Handleliste' size='sm'>
          <Checkbox value='epost'>En kilo poteter</Checkbox>
          <Checkbox value='telefon'>To liter Farris</Checkbox>
          <Checkbox value='sms' defaultChecked>
            Blomkål
          </Checkbox>
          <Checkbox value='sms' defaultChecked>
            Pizza
          </Checkbox>
          <Checkbox value='sms' defaultChecked>
            Tre liter lettmelk
          </Checkbox>
          <Checkbox value='sms'>2kg smågodt</Checkbox>
          <Checkbox value='sms'>10 poser med Smash</Checkbox>
        </Checkbox.Group>
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
            <Select label='Velg handling' size='sm' hideLabel>
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
        <Pagination
          currentPage={3}
          nextLabel='Neste'
          onChange={function Ya() {}}
          previousLabel='Forrige'
          size='sm'
          totalPages={6}
        />
      </div>
      <div className={cl(classes.card, classes.help)}>
        <Heading size='xs' className={classes.helpHeading}>
          Hva kan vi hjelpe deg med?
        </Heading>
        <div className={classes.helpCards}>
          <Card color='brand1' className={classes.helpFirst}>
            <Card.Header className={classes.helpHeader}>
              <Heading size='2xs' className={classes.helpFirstTitle}>
                Sikkerhet og drift
              </Heading>
            </Card.Header>
            <Card.Content
              className={cl(classes.helpContent, classes.helpFirstDesc)}
            >
              Most provide as with carried business are much better more the.
            </Card.Content>
          </Card>
          <Card color='brand2' className={classes.helpSecond}>
            <Card.Header className={classes.helpHeader}>
              <Heading size='2xs' className={classes.helpSecondTitle}>
                Skole og utdanning
              </Heading>
            </Card.Header>
            <Card.Content
              className={cl(classes.helpContent, classes.helpSecondDesc)}
            >
              Most provide as with carried business are much better more the.
            </Card.Content>
          </Card>
          <Card color='brand3' className={classes.helpThird} isLink asChild>
            <a href='#preview'>
              <Card.Header className={classes.helpHeader}>
                <Heading className={classes.helpThirdTitle} size='2xs'>
                  Mat og helse
                </Heading>
              </Card.Header>
              <Card.Content
                className={cl(classes.helpContent, classes.helpThirdDesc)}
              >
                Lenke til artikkel om mat og helse, der du kan lese mer om alt.
              </Card.Content>
            </a>
          </Card>
        </div>
      </div>
      <div className={cl(classes.card, classes.radio)}>
        <Radio.Group
          error=''
          legend='Hvilken iskremsmak er best?'
          description='Velg din favorittsmak'
          size='sm'
          value={radioValue}
          onChange={(e: string) => setRadioValue(e)}
        >
          <Radio value='vanilje'>Vanilje</Radio>
          <Radio value='jordbær'>Jordbær</Radio>
          <Radio value='sjokolade'>Sjokolade</Radio>
          <Radio value='spiser-ikke-is'>Jeg spiser ikke iskrem</Radio>
        </Radio.Group>
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
        >
          <Switch defaultChecked>TV-visning</Switch>
          <Switch size='sm'>Desktopvisning</Switch>
          <Switch defaultChecked readOnly>
            Tabletvisning
          </Switch>
          <Switch disabled>Mobilvisning</Switch>
        </Fieldset>
      </div>
      <div className={cl(classes.card, classes.toggleGroup)}>
        <Heading size='xs' spacing>
          Hvor er du fra?
        </Heading>
        <Paragraph size='sm' spacing>
          Svar under så finner vi flyreise
        </Paragraph>
        <div className={classes.toggleCombo}>
          <ToggleGroup defaultValue='norway' size='sm'>
            <ToggleGroup.Item value='norway'>Norge</ToggleGroup.Item>
            <ToggleGroup.Item value='sweden'>Sverige</ToggleGroup.Item>
            <ToggleGroup.Item value='utlandet'>Utlandet</ToggleGroup.Item>
          </ToggleGroup>
        </div>
        <Heading size='xs' spacing className={classes.chipsHeading}>
          Filtrer på språk
        </Heading>
        <div className={classes.chips}>
          <Chip.Toggle selected checkmark={false} size='sm'>
            Bokmål
          </Chip.Toggle>
          <Chip.Toggle size='sm'>Nynorsk</Chip.Toggle>
          <Chip.Toggle size='sm'>Engelsk</Chip.Toggle>
        </div>
      </div>
      <div className={cl(classes.card, classes.comboBox)}>
        <Heading size='xs' spacing className={classes.comboHeading}>
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
        <Textarea
          cols={40}
          rows={3}
          description=''
          placeholder='Skriv her...'
          error=''
          label='Ekstra informasjon'
          size='sm'
          className={classes.textarea}
        />
      </div>
      <div className={cl(classes.card, classes.tabs)}>
        <Tabs.Root defaultValue='value1' size='sm'>
          <Tabs.List>
            <Tabs.Tab value='value1'>Min profil</Tabs.Tab>
            <Tabs.Tab value='value2'>Tjenester</Tabs.Tab>
            <Tabs.Tab value='value3'>Innstillinger</Tabs.Tab>
          </Tabs.List>
        </Tabs.Root>
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
              For å kunne bli registrert i Frivillighetsregisteret, må
              organisasjonen drive frivillig virksomhet. Det er bare foreninger,
              stiftelser og aksjeselskap som kan registreres. Virksomheten kan
              ikke dele ut midler til fysiske personer. Virksomheten må ha et
              styre.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Accordion.Heading>
            <Accordion.Content>
              Virksomheten må være registrert i Enhetsregisteret før den kan bli
              registrert i Frivillighetsregisteret. Du kan registrere i begge
              registrene samtidig i Samordnet registermelding.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Heading>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Accordion.Heading>
            <Accordion.Content>
              Virksomheten må være registrert i Enhetsregisteret før den kan bli
              registrert i Frivillighetsregisteret. Du kan registrere i begge
              registrene samtidig i Samordnet registermelding.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className={cl(classes.card, classes.alert)}>
        <Alert color='info'>
          Dette er informasjon som du bør lese for å forstå hva som skjer
        </Alert>
        <Alert color='warning'>
          Dette er en advarsel om at noe kan gå galt hvis du ikke følger med
        </Alert>
        <Alert color='danger'>
          Dette er en melding om at noe har gått galt og du bør gjøre noe med
          det
        </Alert>
        <Alert color='success'>
          Dette er en melding om at noe har gått bra og du kan fortsette
        </Alert>
      </div>
      <div className={cl(classes.card, classes.dropdown)}>
        <DropdownMenu.Root placement='top'>
          <DropdownMenu.Trigger>Velg språk</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Norsk</DropdownMenu.Item>
            <DropdownMenu.Item>Engelsk</DropdownMenu.Item>
            <DropdownMenu.Item>Spansk</DropdownMenu.Item>
            <DropdownMenu.Item>Fransk</DropdownMenu.Item>
          </DropdownMenu.Content>
          <HelpText title='Du har ikke valgt språk'>
            Velg språk for å endre innholdet på siden
          </HelpText>
        </DropdownMenu.Root>
      </div>
      <div className={cl(classes.card, classes.loaders)}>
        <div className={classes.loadersRest}>
          <Skeleton.Circle width='70px' height='70px' />
          <Skeleton.Rectangle height='70px' width='100px' />
        </div>
        <Skeleton.Text width='100%' />
        <Skeleton.Text width='100%' />
        <div>
          <Spinner title='laster innhold' size='md' />
          <Spinner title='laster innhold' size='md' color='accent' />
        </div>
      </div>
    </div>
  );
};
