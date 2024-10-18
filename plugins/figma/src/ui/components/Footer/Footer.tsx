import { Spinner, Tooltip } from '@digdir/designsystemet-react';
import { ChatElipsisIcon } from '@navikt/aksel-icons';

import packageJson from '../../../../package.json';
import { useThemeStore } from '../../../common/store';

import classes from './Footer.module.css';

export const Footer = () => {
  const loading = useThemeStore((state) => state.loading);

  return (
    <div className={classes.footer}>
      {/* <div className={classes.top}>
        <div className={classes.topLeft}></div>

        <div className={classes.topRight}>

        </div>
      </div> */}
      <div className={classes.bottom}>
        <div className={classes.bottomLeft}>
          {loading && (
            <Spinner title='fff' size='sm' className={classes.spinner} />
          )}
        </div>
        <div className={classes.bottomRight}>
          <div className={classes.version}>V {packageJson.version}</div>
          <Tooltip content='Feedback' placement='top'>
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
