import React from 'react';
import { Markdown } from '@storybook/blocks';

import classes from './Information.module.css';

type Texts = 'token' | 'development' | 'beta';

const texts: Record<Texts, { description: string; title?: string }> = {
  token: {
    title: 'Tokens',
    description:
      'Husk å importere ny tokens-pakke **`@digdir/design-system-tokens/brand/<brand>/tokens.css`** før du tar i bruk denne komponenten.\n\n Importer tokens i henhold til ditt brand; `altinn`, `digdir` eller `tilsynet`.',
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
};

const colorClass = (text: Texts) => {
  switch (text) {
    case 'beta':
      return classes.beta;
    default:
      return '';
  }
};

type InformationProps = {
  text: Texts;
};

export const Information = ({ text }: InformationProps) => {
  const textData = texts[text];

  return (
    <div className={classes.container + ' ' + colorClass(text)}>
      {textData.title && <h2 className={classes.title}>{textData.title}</h2>}
      <div className={classes.desc}>
        <Markdown>{textData.description}</Markdown>
      </div>
    </div>
  );
};
