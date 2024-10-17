import { Card } from '@ui/components/Card/Card';
import { useEffect } from 'react';
import { useThemeStore } from '../../../common/store';

import classes from './Themes.module.css';

function Themes() {
  const themes = useThemeStore((state) => state.themes);
  const noThemeFound = useThemeStore((state) => state.noThemesFound);

  useEffect(() => {}, []);

  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: 'updateTheme' } }, '*');
  };
  const handleClick2 = () => {
    parent.postMessage({ pluginMessage: { type: 'updateTheme2' } }, '*');
  };

  return (
    <div className={classes.content}>
      {noThemeFound && (
        <p className={classes.noThemes}>
          Fant ingen temaer. Husk at du må åpne pluginen i designsystemet sin
          Core Ui kit Figma community fil.
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
                brand1Base: theme.colors.brand1.light?.[9] ?? '',
                brand2Base: theme.colors.brand2.light?.[9] ?? '',
                brand3Base: theme.colors.brand3.light?.[9] ?? '',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Themes;
