import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { X, Download } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

import { CodeSnippet } from '../CodeSnippet/CodeSnippet';

import classes from './SvgModal.module.css';

interface SvgModalProps {
  Icon: React.ReactNode;
  name: string;
  showModal: boolean;
  closeModal: any;
  packageName: string;
  newIcon: boolean;
}

const SvgModal = ({
  Icon,
  name,
  showModal = false,
  closeModal,
  packageName,
  newIcon,
}: SvgModalProps) => {
  const icon = <Icon />;

  const onClickHandler = () => {
    closeModal();
  };

  return (
    <>
      {showModal && (
        <div className={classes['svg-modal']}>
          <div
            role='button'
            onClick={() => onClickHandler()}
            className={classes['svg-modal__opacity']}
          ></div>

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
                    size={25}
                  />{' '}
                  Last ned svg
                </button>
                <button
                  onClick={() => onClickHandler()}
                  className={classes['svg-modal__close-btn']}
                >
                  <X
                    size={30}
                    color='#686868'
                  />
                </button>
              </div>
            </div>
            <div className={classes['svg-modal__content']}>
              <div className={classes['svg-modal__content-left']}>
                <Icon
                  height={160}
                  width={160}
                />
              </div>
              <div className={classes['svg-modal__content-right']}>
                <h3>React og SVG import</h3>
                <CodeSnippet
                  language='javascript'
                  children={`
import { ${name} }  from '${packageName}';
              `}
                />
                <CodeSnippet
                  language='javascript'
                  children={`
import ${name} from '${packageName}/svg/${name}.svg';
              `}
                />
                <h3 className={classes['svg-modal__svg-title']}>SVG</h3>
                <CodeSnippet
                  language='plain'
                  children={ReactDOMServer.renderToString(icon)}
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
