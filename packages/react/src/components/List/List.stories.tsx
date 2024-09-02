import type { Meta, StoryFn } from '@storybook/react';

import { List } from '.';
import { Link } from '../Link';
import { Heading } from '../Typography/Heading';

type Story = StoryFn<typeof List>;

const decorators = [
  (Story: StoryFn) => (
    <div style={{ margin: '5rem' }}>
      <Story />
    </div>
  ),
];

export default {
  title: 'Komponenter/List',
  component: List,
  decorators,
} as Meta;

export const Preview: Story = (args) => (
  <>
    <List {...args}>
      <List.Item>List Item 1</List.Item>
      <List.Item>List Item 2</List.Item>
      <List.Item>List Item 3</List.Item>
    </List>
  </>
);

Preview.args = {
  size: 'md',
};

export const Sortert: Story = (args) => (
  <>
    <Heading level={2} size='xs' spacing>
      Slik gjør du
    </Heading>
    <List {...args}>
      <List.Item>
        Tørk over kyllingfiletene før du krydrer og steker. Dette vil gi en
        finere stekeskorpe på kjøttet. Ikke bruk kjøkkenpapir som loer.
        Papirbiter i maten er ikke noe særlig.
      </List.Item>
      <List.Item>
        Ha salt og pepper på filetene og eventuelt annet krydder for ekstra
        smak. Hvitløkpepper, paprika eller provence kan gi en god smak!
      </List.Item>
      <List.Item>
        Stek filetene på sterk varme i to minutter på hver side. Sett deretter
        på lokk og stek videre på svak varme i syv minutter på hver side.
      </List.Item>
    </List>
  </>
);

Sortert.args = {
  variant: 'ordered',
};

export const Usortert: Story = (args) => (
  <>
    <Heading level={2} size='xs' spacing>
      Foreningen har plikt til å ha revisor hvis de har
    </Heading>
    <List {...args}>
      <List.Item>
        et gjennomsnittlig antall ansatte som tilsvarer ti årsverk eller mer
      </List.Item>
      <List.Item>balansesum som er 27 millioner kroner eller mer</List.Item>
      <List.Item>
        driftsinntekter for sin samlede virksomhet på 7 millioner kroner eller
        mer
      </List.Item>
    </List>
  </>
);

export const UtenOverskrift: Story = (args) => (
  <>
    <List {...args}>
      <List.Item>Lasagne</List.Item>
      <List.Item>Taco</List.Item>
      <List.Item>Pizza</List.Item>
    </List>
  </>
);

export const Innrykk: Story = (args) => (
  <>
    <Heading level={2} size='xs' spacing>
      Nested lists
    </Heading>
    <List {...args}>
      <List.Item>
        <Heading level={3} size='xs' spacing>
          {' '}
          List Item 1
        </Heading>
        <List variant='ordered'>
          <List.Item>List Item 1.1</List.Item>
          <List.Item>List Item 1.2</List.Item>
          <List.Item>List Item 1.3</List.Item>
        </List>
      </List.Item>
      <List.Item>
        <Heading level={3} size='xs' spacing>
          {' '}
          List Item 2
        </Heading>
        <List>
          <List.Item>List Item 2.1</List.Item>
          <List.Item>List Item 2.2</List.Item>
          <List.Item>List Item 2.3</List.Item>
        </List>
      </List.Item>
      <List.Item>
        <Heading level={3} size='xs' spacing>
          {' '}
          List Item 3
        </Heading>
        <List>
          <List.Item>List Item 3.1</List.Item>
          <List.Item>List Item 3.2</List.Item>
          <List.Item>List Item 3.3</List.Item>
        </List>
      </List.Item>
    </List>
  </>
);

export const ListeMedLenker: Story = (args) => (
  <>
    <Heading level={2} size='xs' spacing>
      Designsystemet
    </Heading>
    <List {...args}>
      <List.Item>
        <Link
          href='https://www.designsystemet.no/grunnleggende'
          target='_blank'
        >
          Grunnleggende
        </Link>
      </List.Item>
      <List.Item>
        <Link href='https://www.designsystemet.no/god-praksis' target='_blank'>
          God praksis
        </Link>
      </List.Item>
      <List.Item>
        <Link href='https://www.designsystemet.no/monstre' target='_blank'>
          Mønstre
        </Link>
      </List.Item>
    </List>
  </>
);

ListeMedLenker.args = {
  variant: 'none',
};
