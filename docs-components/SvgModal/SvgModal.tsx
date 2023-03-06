import React, { cloneElement } from 'react';
import { Close, Download } from '@navikt/ds-icons';
import { renderToString } from 'react-dom/server';
import { Source } from '@storybook/addon-docs';

import classes from './SvgModal.module.css';

interface SvgModalProps {
  icon: React.ReactElement;
  name: string;
  showModal: boolean;
  closeModal: () => void;
  packageName: string;
  newIcon: boolean;
}

const SvgModal = ({
  icon,
  name,
  showModal = false,
  closeModal,
  packageName,
  newIcon,
}: SvgModalProps) => {
  const Icon = cloneElement(icon, { height: 160, width: 160 });

  const onClickHandler = () => {
    closeModal();
  };

  return (
    <>
      {showModal && (
        <div className={classes['svg-modal']}>
          <button
            onClick={() => onClickHandler()}
            className={classes['svg-modal__opacity']}
          >
            close
          </button>

          <div className={classes['svg-modal__box']}>
            <div className={classes['svg-modal__header']}>
              <div className={classes['svg-modal__header-left']}>
                <h2>{name}</h2>
                {newIcon ? (
                  <div className={classes['svg-modal__new']}>Ny!</div>
                ) : (
                  ''
                )}
              </div>
              <div className={classes['svg-modal__header-right']}>
                <button className={classes['svg-modal__svg-btn']}>
                  <Download
                    color='#1E2B3C'
                    scale={3}
                  />
                  Last ned svg
                </button>
                <button
                  onClick={() => onClickHandler()}
                  className={classes['svg-modal__close-btn']}
                >
                  <Close
                    scale={3}
                    color='#686868'
                  />
                </button>
              </div>
            </div>
            <div className={classes['svg-modal__content']}>
              <div className={classes['svg-modal__content-left']}>{Icon}</div>
              <div className={classes['svg-modal__content-right']}>
                <h3>React og SVG import</h3>
                <Source
                  language='javascript'
                  code={`
import { ${name} }  from '${packageName}';
              `}
                />
                <Source
                  language='javascript'
                  code={`
import ${name} from '${packageName}/svg/${name}.svg';
              `}
                />
                <h3 className={classes['svg-modal__svg-title']}>SVG</h3>
                <Source
                  language='plain'
                  code={renderToString(icon)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { SvgModal };
