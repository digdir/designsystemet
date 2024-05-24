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
          className={cl('fds-skrr', 'another', `fds-${DEFAULT}`)}
        ></button>
      </div>
      <div className={`fds-${DEFAULT}`}></div>
    </>
  );
}
