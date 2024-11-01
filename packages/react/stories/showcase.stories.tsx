import type { Meta, StoryFn } from '@storybook/react';
import cl from 'clsx/lite';
import { useState } from 'react';

import {
  Accordion,
  Avatar,
  Button,
  Card,
  Checkbox,
  Combobox,
  Divider,
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
  Tabs,
  Tag,
  Textfield,
  ToggleGroup,
  Tooltip,
  usePagination,
} from '../src';

import type { Size } from '../src/types';
import classes from './showcase.module.css';

export default {
  title: 'Showcase',
  parameters: {
    chromatic: {
      modes: {
        mobile: {
          disable: true,
        },
      },
    },
  },
} as Meta;

const sizes: Size[] = ['sm', 'md', 'lg'];
const colorModes = ['light', 'dark', 'auto'];
const typography = ['primary', 'secondary'];

export const Showcase: StoryFn = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState<Size>('sm');
  const [colorMode, setColorMode] = useState('auto');
  const [typographyMode, setTypographyMode] = useState('primary');
  const pagination = usePagination({
    currentPage,
    setCurrentPage,
    totalPages: 10,
    showPages: 7,
  });

  return (
    <div>
      <div className={classes.controls} data-size='sm'>
        <Fieldset>
          <Fieldset.Legend>
            Størrelse
            <code data-size='xs'>(data-size)</code>
          </Fieldset.Legend>
          <ToggleGroup value={size} onChange={(val) => setSize(val as Size)}>
            {sizes.map((size) => (
              <ToggleGroup.Item key={size} value={size}>
                {size}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Fieldset>
        <Fieldset>
          <Fieldset.Legend>
            Fargemodus
            <code data-size='xs'>(data-ds-color-mode)</code>
          </Fieldset.Legend>
          <ToggleGroup value={colorMode} onChange={setColorMode}>
            {colorModes.map((colorMode) => (
              <ToggleGroup.Item key={colorMode} value={colorMode}>
                {colorMode}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Fieldset>
        <Fieldset>
          <Fieldset.Legend>
            Typografi
            <code data-size='xs'>(data-ds-typography)</code>
          </Fieldset.Legend>
          <ToggleGroup value={typographyMode} onChange={setTypographyMode}>
            {typography.map((typographyMode) => (
              <ToggleGroup.Item key={typographyMode} value={typographyMode}>
                {typographyMode}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </Fieldset>
      </div>
      <div
        className={classes.components}
        data-size={size}
        data-ds-color-mode={colorMode}
        data-ds-typography={typographyMode}
      >
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
          <Tooltip content='Trykk for å få hjelp' portal={false}>
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
            <Search
              label='Label'
              placeholder='Søk etter bruker...'
              variant='simple'
              className={classes.tableSearch}
            />
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
          <Heading className={classes.helpHeading}>
            Hva kan vi hjelpe deg med?
          </Heading>
          <div className={classes.helpCards}>
            <Card color='brand1'>
              <Heading>Sikkerhet og drift</Heading>
              <Paragraph>
                Most provide as with carried business are much better more the.
              </Paragraph>
            </Card>
            <Card color='brand2'>
              <Heading>Skole og utdanning</Heading>
              <Paragraph>
                Most provide as with carried business are much better more the.
              </Paragraph>
            </Card>
            <Card color='brand3'>
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
            <Radio label='Vanile' value='vanilje' />
            <Radio label='Jordbær' value='jordbær' defaultChecked />
            <Radio label='Sjokolade' value='sjokolade' />
            <Radio label='Jeg spiser ikke iskrem' value='spiser-ikke-is' />
          </Fieldset>
        </div>
        <div className={cl(classes.card, classes.tag)}>
          <Heading>Emner</Heading>
          <div className={classes.tagList}>
            <Tag color='brand1'>Data og IKT</Tag>
            <Tag color='brand2'>Mat og ernæring</Tag>
            <Tag color='brand3'>Sport og Idrett</Tag>
            <Tag color='neutral'>Politikk og samfunn</Tag>
            <Tag color='success'>Utenriks</Tag>
            <Tag color='info'>Helse og velvære</Tag>
            <Tag color='danger'>PC Gaming</Tag>
            <Tag color='warning'>Trening og livsstil</Tag>
          </div>
        </div>
        <div className={cl(classes.card, classes.switches)}>
          <Heading style={{ marginBottom: 'var(--ds-spacing-2)' }}>
            Innstillinger
          </Heading>
          <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
            Her kan du justere på innstillingene dine
          </Paragraph>
          <div className={classes.switchGroup}>
            <Switch defaultChecked>TV-visning</Switch>
            <Switch>Desktopvisning</Switch>
            <Switch defaultChecked readOnly>
              Tabletvisning
            </Switch>
            <Switch disabled>Mobilvisning</Switch>
          </div>
        </div>
        <div className={cl(classes.card, classes.combobox)}>
          <Heading style={{ marginBottom: 'var(--ds-spacing-2)' }}>
            Hvor er du fra?
          </Heading>
          <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
            Svar under så finner vi flyreise
          </Paragraph>
          <div className={classes.toggleCombo}>
            <ToggleGroup defaultValue='norway'>
              <ToggleGroup.Item value='norway'>Norge</ToggleGroup.Item>
              <ToggleGroup.Item value='sweden'>Sverige</ToggleGroup.Item>
              <ToggleGroup.Item value='utlandet'>Utlandet</ToggleGroup.Item>
            </ToggleGroup>
            <Combobox
              description='Velg et sted'
              label='Hvor går reisen?'
              portal={false}
              multiple
            >
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
          <Heading className={classes.cardTitle}>Ofte stillte spørsmål</Heading>
          <Accordion color='brand3' border>
            <Accordion.Item>
              <Accordion.Heading>
                Hvem kan registrere seg i Frivillighetsregisteret?
              </Accordion.Heading>
              <Accordion.Content>
                For å kunne bli registrert i Frivillighetsregisteret, må
                organisasjonen drive frivillig virksomhet. Det er bare
                foreninger, stiftelser og aksjeselskap som kan registreres.
                Virksomheten kan ikke dele ut midler til fysiske personer.
                Virksomheten må ha et styre.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Heading>
                Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
              </Accordion.Heading>
              <Accordion.Content>
                Virksomheten må være registrert i Enhetsregisteret før den kan
                bli registrert i Frivillighetsregisteret. Du kan registrere i
                begge registrene samtidig i Samordnet registermelding.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Heading>
                Hvordan går jeg fram for å registrere i Frivillighetsregisteret?
              </Accordion.Heading>
              <Accordion.Content>
                Virksomheten må være registrert i Enhetsregisteret før den kan
                bli registrert i Frivillighetsregisteret. Du kan registrere i
                begge registrene samtidig i Samordnet registermelding.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
