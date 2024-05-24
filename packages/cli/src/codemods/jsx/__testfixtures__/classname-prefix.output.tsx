import cl from 'classnames';

const DEFAULT = 'default';

export default function JsxTest() {
  return (
    <>
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
            typeof DEFAULT === 'string' ? 'ds-yes' : 'ds-no',
          )}
        ></button>
      </div>
      <div className={`ds-${DEFAULT}`}></div>
    </>
  );
}
