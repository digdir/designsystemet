import cl from 'classnames';

const DEFAULT = 'fds-default';

export default function JsxTest({ className }: { className?: string }) {
  return (
    <div>
      <div
        className='ds-hey'
        onMouseEnter={() => {}}
      >
        <button
          className={cl(
            'ds-skrr',
            'another',
            `ds-${DEFAULT}`,
            true && 'ds-hey',
            true && `ds-${DEFAULT}`,
            DEFAULT.includes('fds-') ? 'ds-yes' : 'ds-no',
            typeof DEFAULT === 'string'
              ? 'ds-yes'
              : typeof DEFAULT === 'function'
                ? 'ds-no'
                : 'ds-yes',
            className,
          )}
        ></button>
      </div>
      <div className={`ds-${DEFAULT}`}></div>
    </div>
  );
}
