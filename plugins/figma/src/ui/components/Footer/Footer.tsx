import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { Button, Spinner, Tooltip } from '@digdir/designsystemet-react';
import { Code, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import packageJson from '../../../../package.json';
import { useThemeStore } from '../../../common/store';

import classes from './Footer.module.css';

export const Footer = () => {
  const themes = useThemeStore((state) => state.themes);
  const loading = useThemeStore((state) => state.loading);
  const setLoading = useThemeStore((state) => state.setLoading);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'updateVariables',
            themes: themes,
          },
        },
        '*',
      );
    }, 500);
  };

  return (
    <div className={classes.footer}>
      <div className={classes.top}>
        <div className={classes.topLeft}>
          <Button
            className={classes.btn}
            size='sm'
            onClick={() => handleClick()}
          >
            Oppdater variabler
          </Button>
        </div>

        <div className={classes.topRight}>
          {loading && (
            <Spinner
              title='fff'
              size='sm'
              className={classes.spinner}
            />
          )}
        </div>
      </div>
      <div className={classes.bottom}>
        <div className={classes.bottomLeft}>
          <Link
            className={classes.link}
            to='/github'
          >
            <Button
              className={classes.github}
              size='sm'
              color='neutral'
              variant='tertiary'
            >
              <Github size={17} />
              Github
            </Button>
          </Link>
          <Link
            className={classes.link}
            to='/github'
          >
            <Button
              className={classes.github}
              size='sm'
              color='neutral'
              variant='tertiary'
            >
              <Code size={17} />
              NPM
            </Button>
          </Link>
        </div>
        <div className={classes.bottomRight}>
          <div className={classes.version}>V {packageJson.version}</div>
          <Tooltip
            content='Feedback'
            placement='top'
          >
            <a
              href='https://github.com/digdir/designsystemet'
              rel='noreferrer'
              target='_blank'
              className={classes.feedback}
            >
              <ChatElipsisIcon fontSize='1.3rem' />
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
