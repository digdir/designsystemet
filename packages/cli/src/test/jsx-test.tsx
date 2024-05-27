import cl from 'classnames';

const DEFAULT = 'fds-default';

export default function JsxTest({ className }: { className?: string }) {
  return (
    <div>
      <div
        className='fds-hey'
        onMouseEnter={() => 'fds-func'}
      >
        <button
          className={cl(
            'fds-skrr',
            'another',
            `fds-${DEFAULT}`,
            true && 'fds-hey',
            true && `fds-${DEFAULT}`,
            DEFAULT.includes('fds-') ? 'fds-yes' : 'fds-no',
            typeof DEFAULT === 'string'
              ? 'fds-yes'
              : typeof DEFAULT === 'function'
                ? 'fds-no'
                : 'fds-yes',
            className,
          )}
        ></button>
      </div>
      <div className={`fds-${DEFAULT}`}></div>
    </div>
  );
}
