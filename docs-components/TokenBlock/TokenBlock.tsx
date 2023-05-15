import React from 'react';
import { Markdown } from '@storybook/blocks';

import classes from './TokenBlock.module.css';

export const TokenBlock = () => (
  <div className={classes.container}>
    <div className={classes.desc}>
      <Markdown>
        {
          ' Husk å importer ny tokens pakke **`@digdir/design-system-tokens/<brand>/tokens.css`** før du tar i bruk denne komponenten.\n\n Importer tokens i henhold til ditt brand; `altinn`, `digdir` eller `tilsynet`.'
        }
      </Markdown>
    </div>
  </div>
);
