import React from 'react';
import { Markdown } from '@storybook/blocks';

import classes from './Information.module.css';

type Texts = 'token' | 'development';

const texts: Record<Texts, string> = {
  token:
    ' Husk å importere ny tokens-pakke **`@digdir/design-system-tokens/<brand>/tokens.css`** før du tar i bruk denne komponenten.\n\n Importer tokens i henhold til ditt brand; `altinn`, `digdir` eller `tilsynet`.',
  development:
    'Komponenten er under utvikling og dermed ikke tilgjenglige i react pakken `@digdir/design-system-react`',
};

type InformationProps = {
  text: Texts;
};

export const Information = ({ text }: InformationProps) => (
  <div className={classes.container}>
    <div className={classes.desc}>
      <Markdown>{texts[text]}</Markdown>
    </div>
  </div>
);
