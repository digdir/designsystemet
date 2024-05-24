import cl from 'classnames';

const DEFAULT = 'default';

export default function JsxTest() {
  return (
    <>
      <div
        className='fds-hey'
        onMouseEnter={() => {}}
      >
        <button
          className={cl(
            'fds-skrr',
            'another',
            `fds-${DEFAULT}`,
            true && 'fds-hey',
            true && `fds-${DEFAULT}`,
            typeof DEFAULT === 'string' ? 'fds-yes' : 'fds-no',
            typeof DEFAULT === 'string'
              ? 'fds-yes'
              : typeof DEFAULT === 'function'
                ? 'fds-no'
                : 'fds-yes',
          )}
        ></button>
      </div>
      <div className={`fds-${DEFAULT}`}></div>
    </>
  );
}
