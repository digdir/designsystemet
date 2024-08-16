import {
  AlignVerticalSpaceAround,
  Palette,
  Pencil,
  Shapes,
  Type,
  Check,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@digdir/designsystemet-react';

import { Card } from '@ui/components/Card/Card';
import { Breadcrumbs } from '@ui/components/Breadcrumbs/Breadcrumbs';

import { useThemeStore } from '../../../common/store';

import classes from './Theme.module.css';

function Theme() {
  const { themeId } = useParams();
  const themes = useThemeStore((state) => state.themes);
  const [newName, setNewName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const setLoading = useThemeStore((state) => state.setLoading);

  const Tomato = (e: string) => {
    setNewName(e);
  };

  const changeName = () => {
    setLoading(true);
    setEditMode(false);
    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'renameTheme',
            renameTheme: {
              newName: newName,
              themeModeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeModeId,
              themeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeId,
            },
          },
        },
        '*',
      );
    }, 500);
  };

  const deleteClicked = () => {
    setLoading(true);
    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'deleteTheme',
            deleteTheme: {
              themeModeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeModeId,
              themeId: themes.find((theme) => theme.themeModeId === themeId)
                ?.themeId,
            },
          },
        },
        '*',
      );
    }, 500);
  };

  return (
    <div className={classes.content}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <Breadcrumbs
            text={themes.find((theme) => theme.themeModeId === themeId)?.name}
            url='/'
          />
          {!editMode && (
            <Pencil
              size={16}
              className={classes.edit}
              onClick={() => setEditMode(true)}
            />
          )}
          {editMode && (
            <>
              <input
                type='text'
                placeholder='Nytt navn...'
                onChange={(e) => Tomato(e.target.value)}
                className={classes.input}
              />
              <Check
                onClick={() => changeName()}
                size={18}
                className={classes.edit}
              />
            </>
          )}
        </div>
        <div className={classes.headerRight}>
          <Button
            size='sm'
            color='danger'
            variant='tertiary'
            className={classes.removeBtn}
            onClick={() => deleteClicked()}
          >
            Slett tema
          </Button>
        </div>
      </div>
      <div className={classes.cards}>
        <Card
          url={'/themes/' + themeId + '/colors'}
          title='Farger'
          icon={<Palette />}
        />
        <Card
          url='/themes/altinn/colors'
          title='Border Radius'
          icon={<Shapes />}
        />
        <Card
          url={'/themes/' + themeId + '/fonts'}
          title='Fonter'
          icon={<Type />}
        />
        <Card
          url='/themes/altinn/colors'
          title='Avstander'
          icon={<AlignVerticalSpaceAround />}
        />
      </div>
    </div>
  );
}

export default Theme;
