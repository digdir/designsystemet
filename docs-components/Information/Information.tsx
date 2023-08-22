import React from 'react';
import { Markdown } from '@storybook/blocks';

import classes from './Information.module.css';

type Texts = 'token' | 'development' | 'beta' | 'deprecated';

const texts: Record<Texts, { description: string; title?: string }> = {
  token: {
    title: 'Tokens',
    description:
      'Husk å importere ny tokens-pakke **`@digdir/design-system-tokens/brand/<brand>/tokens.css`** før du tar i bruk denne komponenten.\n\n Importer tokens i henhold til ditt brand; `altinn`, `digdir`, `brreg` eller `tilsynet`.',
  },
  development: {
    title: 'Under utvikling',
    description:
      'Komponenten er under utvikling og dermed ikke tilgjenglig i `@digdir/design-system-react`.',
  },
  beta: {
    title: 'Beta',
    description:
      'Komponenten er i beta og kan dermed ha mangelfull funksjonalitet eller være flagget for endring.\n\n Dette kan medføre breaking-changes i patch/minor versjon av kodepakker.',
  },
  deprecated: {
    title: 'Avviklet',
    description:
      'Komponenten er avviklet fordi den ikke er i målgruppen lenger eller erstattet av en eller flere nye komponenter.',
  },
};

const colorClass = (text: Texts) => {
  switch (text) {
    case 'beta':
      return classes.beta;
    case 'deprecated':
      return classes.danger;
    default:
      return '';
  }
};

type InformationProps = {
  text: Texts;
  description?: string;
};

export const Information = ({ text, description }: InformationProps) => {
  const textData = texts[text];

  return (
    <div className={classes.container + ' ' + colorClass(text)}>
      {textData.title && <h2 className={classes.title}>{textData.title}</h2>}
      <div className={classes.desc}>
        <Markdown>{`${textData.description} \n\n  ${
          description || ''
        }`}</Markdown>
      </div>
    </div>
  );
};
