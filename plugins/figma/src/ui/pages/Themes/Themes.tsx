import { Card } from '@ui/components/Card/Card';
import { useEffect } from 'react';
import { useThemeStore } from '../../../common/store';

import { Heading } from '@digdir/designsystemet-react';
import classes from './Themes.module.css';

function Themes() {
  const themes = useThemeStore((state) => state.themes);
  const noThemeFound = useThemeStore((state) => state.noThemesFound);

  useEffect(() => {}, []);

  return (
    <div className={classes.content}>
      <Heading data-size='2xs' className={classes.heading}>
        Mine temaer
      </Heading>
      {noThemeFound && (
        <p>
          Fant ingen temaer. Husk at du må åpne pluginen i designsystemet sin
          Core UI kit Figma community fil.
        </p>
      )}
      <div className={classes.cards}>
        {themes.map((theme, index) => {
          return (
            <Card
              key={index}
              title={theme.name}
              url={`/themes/${theme.themeModeId}`}
              colors={{
                colorDot1: theme.colors.accent.light?.[12] ?? '',
                colorDot2: theme.colors.extra1.light?.[12] ?? '',
                colorDot3: theme.colors.extra2.light?.[12] ?? '',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Themes;
