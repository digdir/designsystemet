import cl from 'classnames';

const DEFAULT = 'default';

export default function JsxTest() {
  return (
    <>
      <div
        className='ds-hey'
        onMouseEnter={() => {}}
      >
        <button className={cl('ds-skrr', 'another', `fds-${DEFAULT}`)}></button>
      </div>
      <div className={`ds-${DEFAULT}`}></div>
    </>
  );
}
