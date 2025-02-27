'use client';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Details,
  Divider,
  Field,
  Fieldset,
  Heading,
  Label,
  Link,
  Pagination,
  Paragraph,
  Radio,
  Search,
  Select,
  EXPERIMENTAL_Suggestion as Suggestion,
  Switch,
  Table,
  Tabs,
  Tag,
  Textfield,
  ToggleGroup,
  Tooltip,
  usePagination,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { type HTMLAttributes, useState } from 'react';
import classes from './Showcase.module.css';

const DATA_PLACES = [
  'Sogndal',
  'Oslo',
  'Brønnøysund',
  'Stavanger',
  'Trondheim',
  'Bergen',
  'Lillestrøm',
];

type ShowcaseProps = HTMLAttributes<HTMLDivElement>;

export function Showcase({ className, ...props }: ShowcaseProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pagination = usePagination({
    currentPage,
    setCurrentPage,
    totalPages: 10,
    showPages: 7,
  });

  return (
    <div className={cl(classes.components, className)} {...props}>
      <div className={cl(classes.card, classes.checkbox)}>
        <Fieldset>
          <Fieldset.Legend>Handleliste</Fieldset.Legend>
          <Checkbox label='En kilo poteter' value='epost' />
          <Checkbox label='To liter Farris' value='telefon' />
          <Checkbox label='Blomkål' value='sms' defaultChecked />
          <Checkbox label='Pizza' value='sms' defaultChecked />
          <Checkbox label='Tre liter lettmelk' value='sms' defaultChecked />
          <Divider />
          <Checkbox label='2kg smågodt' value='sms' />
          <Checkbox label='10 poser med Smash' value='sms' />
        </Fieldset>
      </div>
      <div className={cl(classes.card, classes.user)}>
        <Heading className={cl(classes.cardTitle, classes.userTitle)}>
          Opprett ny bruker
        </Heading>
        <Textfield
          label='Navn'
          placeholder='Ola Normann'
          className={classes.userField}
        />
        <Textfield
          type='email'
          label='E-post'
          placeholder='ola@norge.no'
          className={classes.userField}
        />
        <Tooltip content='Trykk for å få hjelp'>
          <Link href='#' className={classes.userLink}>
            Glemt passord?
          </Link>
        </Tooltip>
        <Button className={classes.userBtn}>Opprett ny bruker</Button>
      </div>
      <div className={cl(classes.card, classes.tableContainer)}>
        <Heading className={classes.cardTitle}>Alle brukere</Heading>
        <div className={classes.tableHeader}>
          <div className={classes.tableAction}>
            <Select aria-label='Velg handling'>
              <Select.Option value='blank'>Velg handling</Select.Option>
              <Select.Option value='everest'>Dupliser</Select.Option>
              <Select.Option value='aconcagua'>Slett</Select.Option>
              <Select.Option value='denali'>Oppdater</Select.Option>
            </Select>
            <Button className={classes.tableBtn}>Utfør</Button>
          </div>
          <Search className={classes.tableSearch}>
            <Search.Input aria-label='Søk' />
            <Search.Clear />
          </Search>
        </div>
        <Table border className={classes.table}>
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
                <Avatar aria-label='dame'>
                  <img src='img/avatars/female1.png' alt='' />
                </Avatar>
                Lise Nordmann
              </Table.Cell>
              <Table.Cell>lise@nordmann.no</Table.Cell>
              <Table.Cell>22345678</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className={classes.tableCell}>
                <Avatar aria-label='mann'>
                  <img src='img/avatars/male2.png' alt='' />
                </Avatar>
                Ola Nordmann
              </Table.Cell>
              <Table.Cell>ola@nordmann.no</Table.Cell>
              <Table.Cell>87654321</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Pagination>
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Button {...pagination.prevButtonProps}>
                Forrige
              </Pagination.Button>
            </Pagination.Item>
            {pagination.pages.map(({ itemKey, buttonProps, page }) => (
              <Pagination.Item key={itemKey}>
                {typeof page === 'number' && (
                  <Pagination.Button
                    {...buttonProps}
                    aria-label={`Side ${page}`}
                  >
                    {page}
                  </Pagination.Button>
                )}
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
        <Heading className={classes.helpHeading}>
          Hva kan vi hjelpe deg med?
        </Heading>
        <div className={classes.helpCards}>
          <Card data-color='brand1'>
            <Heading>Sikkerhet og drift</Heading>
            <Paragraph>
              Most provide as with carried business are much better more the.
            </Paragraph>
          </Card>
          <Card data-color='brand2'>
            <Heading>Skole og utdanning</Heading>
            <Paragraph>
              Most provide as with carried business are much better more the.
            </Paragraph>
          </Card>
          <Card data-color='brand3'>
            <Heading>
              <a href='#preview'>Mat og helse</a>
            </Heading>
            <Paragraph>
              Lenke til artikkel om mat og helse, der du kan lese mer om alt.
            </Paragraph>
          </Card>
        </div>
      </div>
      <div className={cl(classes.card, classes.radio)}>
        <Fieldset>
          <Fieldset.Legend>Hvilken iskremsmak er best?</Fieldset.Legend>
          <Radio name='iskremsmak' label='Vanile' value='vanilje' />
          <Radio
            name='iskremsmak'
            label='Jordbær'
            value='jordbær'
            defaultChecked
          />
          <Radio name='iskremsmak' label='Sjokolade' value='sjokolade' />
          <Radio
            name='iskremsmak'
            label='Jeg spiser ikke iskrem'
            value='spiser-ikke-is'
          />
        </Fieldset>
      </div>
      <div className={cl(classes.card, classes.tag)}>
        <Heading>Emner</Heading>
        <div className={classes.tagList}>
          <Tag data-color='brand1'>Data og IKT</Tag>
          <Tag data-color='brand2'>Mat og ernæring</Tag>
          <Tag data-color='brand3'>Sport og Idrett</Tag>
          <Tag data-color='neutral'>Politikk og samfunn</Tag>
          <Tag data-color='success'>Utenriks</Tag>
          <Tag data-color='info'>Helse og velvære</Tag>
          <Tag data-color='danger'>PC Gaming</Tag>
          <Tag data-color='warning'>Trening og livsstil</Tag>
        </div>
      </div>
      <div className={cl(classes.card, classes.switches)}>
        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
          Innstillinger
        </Heading>
        <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
          Her kan du justere på innstillingene dine
        </Paragraph>
        <div className={classes.switchGroup}>
          <Switch label='TV-visning' defaultChecked />
          <Switch label='Desktopvisning' />
          <Switch label='Tabletvisning' defaultChecked readOnly />
          <Switch label='Mobilvisning' disabled />
        </div>
      </div>
      <div className={cl(classes.card, classes.combobox)}>
        <Heading style={{ marginBottom: 'var(--ds-size-2)' }}>
          Hvor er du fra?
        </Heading>
        <Paragraph style={{ marginBottom: 'var(--ds-size-2)' }}>
          Svar under så finner vi flyreise
        </Paragraph>
        <div className={classes.toggleCombo}>
          <ToggleGroup defaultValue='norway'>
            <ToggleGroup.Item value='norway'>Norge</ToggleGroup.Item>
            <ToggleGroup.Item value='sweden'>Sverige</ToggleGroup.Item>
            <ToggleGroup.Item value='utlandet'>Utlandet</ToggleGroup.Item>
          </ToggleGroup>
          <Field>
            <Label>Velg en destinasjon</Label>
            <Suggestion>
              <Suggestion.Input />
              <Suggestion.Clear />
              <Suggestion.List>
                <Suggestion.Empty>Tomt</Suggestion.Empty>
                {DATA_PLACES.map((place) => (
                  <Suggestion.Option key={place} value={place}>
                    {place}
                    <div>Kommune</div>
                  </Suggestion.Option>
                ))}
              </Suggestion.List>
            </Suggestion>
          </Field>
        </div>
      </div>
      <div className={cl(classes.card, classes.tabs)}>
        <Tabs defaultValue='value1'>
          <Tabs.List>
            <Tabs.Tab value='value1'>Min profil</Tabs.Tab>
            <Tabs.Tab value='value2'>Tjenester</Tabs.Tab>
            <Tabs.Tab value='value3'>Innstillinger</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Paragraph>
          For å kunne bli registrert i{' '}
          <Link href='#' data-color='neutral'>
            Frivillighetsregisteret
          </Link>
          , må organisasjonen drive frivillig virksomhet. Det er bare
          foreninger,{' '}
          <Link href='#' data-color='neutral'>
            stiftelser
          </Link>{' '}
          og som kan registreres. Virksomheten kan ikke dele ut midler til
          fysiske personer. Virksomheten må ha et styre. Virksomheten må være
          registrert i{' '}
          <Link href='#' data-color='neutral'>
            Enhetsregisteret
          </Link>{' '}
          før den kan bli registrert.
        </Paragraph>
      </div>
      <div className={cl(classes.card, classes.faq)}>
        <Heading className={classes.cardTitle}>Ofte stillte spørsmål</Heading>
        <Card data-color='neutral'>
          <Details>
            <Details.Summary>
              Hvem kan registrere seg i Frivillighetsregisteret?
            </Details.Summary>
            <Details.Content>
              For å kunne bli registrert i Frivillighetsregisteret, må
              organisasjonen drive frivillig virksomhet. Det er bare foreninger,
              stiftelser og aksjeselskap som kan registreres. Virksomheten kan
              ikke dele ut midler til fysiske personer. Virksomheten må ha et
              styre.
            </Details.Content>
          </Details>
          <Details>
            <Details.Summary>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Details.Summary>
            <Details.Content>
              Virksomheten må være registrert i Enhetsregisteret før den kan bli
              registrert i Frivillighetsregisteret. Du kan registrere i begge
              registrene samtidig i Samordnet registermelding.
            </Details.Content>
          </Details>
          <Details>
            <Details.Summary>
              Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
            </Details.Summary>
            <Details.Content>
              Virksomheten må være registrert i Enhetsregisteret før den kan bli
              registrert i Frivillighetsregisteret. Du kan registrere i begge
              registrene samtidig i Samordnet registermelding.
            </Details.Content>
          </Details>
        </Card>
      </div>
    </div>
  );
}
