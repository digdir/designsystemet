import { Markdown } from '@storybook/blocks';

import type { AlertProps } from '@digdir/designsystemet-react';
import { Paragraph, Alert, Heading } from '@digdir/designsystemet-react';

import classes from './Information.module.css';

type Texts = 'token' | 'development' | 'altinn' | 'deprecated';

const texts: Record<Texts, { description: string; title?: string }> = {
  token: {
    title: '',
    description:
      'Husk å importere ny tokens-pakke **`@digdir/designsystemet-theme/brand/<brand>/tokens.css`** før du tar i bruk denne komponenten.\n\n Importer tokens i henhold til ditt brand; `altinn`, `digdir`, `brreg` eller `tilsynet`.',
  },
  development: {
    title: 'Under utvikling',
    description:
      'Komponenten er under utvikling og dermed ikke tilgjenglig i `@digdir/designsystemet-react`.',
  },
  altinn: {
    title: 'Altinn',
    description:
      'Denne komponenten er hentet fra et annet bibliotek. Den skal gjennomgås for å komme opp på ønsket nivå. Når den er ferdig blir den flyttet til Felleskomponenter. Endringer som kreves kan medføre breaking-changes i patch/minor versjon av kodepakker',
  },
  deprecated: {
    title: 'Avviklet',
    description:
      'Komponenten er avviklet fordi den ikke er i målgruppen lenger eller erstattet av en eller flere nye komponenter.',
  },
};

const getSeverity = (text: Texts): AlertProps['severity'] => {
  switch (text) {
    case 'deprecated':
      return 'danger';
    case 'development':
      return 'warning';
    default:
      return 'info';
  }
};

type InformationProps = {
  text: Texts;
  description?: string;
};

export const Information = ({ text, description }: InformationProps) => {
  const textData = texts[text];

  return (
    <Alert className={classes.container} severity={getSeverity(text)}>
      {textData.title && (
        <Heading level={2} size='xs' spacing>
          {textData.title}
        </Heading>
      )}
      <Markdown
        options={{
          overrides: {
            p: (props: Record<string, unknown>) => (
              <Paragraph style={{ maxWidth: '70ch' }} {...props}></Paragraph>
            ),
          },
        }}
      >{`${textData.description} \n\n  ${description || ''}`}</Markdown>
    </Alert>
  );
};
