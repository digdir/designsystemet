import { Button } from '@digdir/designsystemet-react';
import { useEffect } from 'react';

import { Card } from '@ui/components/Card/Card';
import { CardButton } from '@ui/components/CardButton/CardButton';

import { useThemeStore } from '../../../common/store';

import classes from './Themes.module.css';

function Themes() {
  const themes = useThemeStore((state) => state.themes);

  useEffect(() => {}, []);

  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: 'updateTheme' } }, '*');
  };
  const handleClick2 = () => {
    parent.postMessage({ pluginMessage: { type: 'updateTheme2' } }, '*');
  };

  return (
    <div className={classes.content}>
      {/* <Button onClick={() => handleClick2()}>Add theme</Button>
      <Button onClick={() => handleClick()}>update variable</Button> */}
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
        {/* <CardButton url='/theme/add' /> */}
      </div>
    </div>
  );
}

export default Themes;
