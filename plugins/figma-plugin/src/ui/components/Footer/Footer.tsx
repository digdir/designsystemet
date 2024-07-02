import './Footer.css';
import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@digdir/designsystemet-react';

import packageJson from '../../../../package.json';

export const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer__left'></div>
      <div className='footer__right'>
        <div className='version'>V {packageJson.version}</div>
        <Tooltip
          content='Feedback'
          placement='top'
        >
          <a
            href='https://github.com/digdir/designsystemet'
            rel='noreferrer'
            target='_blank'
            className='feedback'
          >
            <ChatElipsisIcon fontSize='1.3rem' />
          </a>
        </Tooltip>
      </div>
    </div>
  );
};
