import { useParams } from 'react-router-dom';
import { Type } from 'lucide-react';

import { Card } from '../../components/Card/Card';
import { useThemeStore } from '../../../common/store';
import { CardButton } from '../../components/CardButton/CardButton';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs';

import classes from './Fonts.module.css';

const Fonts = () => {
  const { themeId } = useParams();
  const themes = useThemeStore((state) => state.themes);

  const getTheme = () => {
    return themes.find((theme) => theme.themeModeId === themeId) || { fonts: [] };
  };

  return (
    <div className={classes.content}>
      <Breadcrumbs
        text={'Fonter - ' + themes.find((theme) => theme.themeModeId === themeId)?.name}
        url='/'
      />
      <div className={classes.cards}>
        {getTheme().fonts.map((theme, index) => {
          return (
            <Card
              key={index}
              title={theme.name}
              url={`/themes/`}
              icon={<Type />}
            />
          );
        })}
        <CardButton url='/theme/add' />
      </div>
    </div>
  );
};

export default Fonts;
