import React from 'react';
import { Markdown } from '@storybook/blocks';

import classes from './Information.module.css';

type Texts = 'token' | 'development' | 'beta';

const texts: Record<
  Texts,
  { description: string; title?: string; colorClass?: string }
> = {
  token: {
    title: 'Tokens',
    description:
      'Husk å importere ny tokens-pakke **`@digdir/design-system-tokens/brand/<brand>/tokens.css`** før du tar i bruk denne komponenten.\n\n Importer tokens i henhold til ditt brand; `altinn`, `digdir` eller `tilsynet`.',
  },
  development: {
    title: 'Under utvikling',
    description:
      'Komponenten er under utvikling og dermed ikke tilgjenglige i react pakken `@digdir/design-system-react`.',
  },
  beta: {
    title: 'Beta',
    description:
      'Komponenten er i beta og kan dermed ha mangelfull funksjonalitet eller være flagget for endring. Dette kan medføre breaking-changes i patch/minor versjon av kodepakker.',
    colorClass: 'beta',
  },
};

type InformationProps = {
  text: Texts;
};

export const Information = ({ text }: InformationProps) => {
  const textData = texts[text];

  const color = textData?.colorClass || '';

  return (
    <div className={classes.container + ' ' + color}>
      {textData.title && <div className={classes.title}>{textData.title}</div>}
      <div className={classes.desc}>
        <Markdown>{textData.description}</Markdown>
      </div>
    </div>
  );
};
