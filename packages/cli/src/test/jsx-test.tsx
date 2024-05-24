import cl from 'classnames';

export default function JsxTest() {
  return (
    <div
      className='fds-hey'
      onMouseEnter={() => {}}
    >
      <button className={cl('fds-skrr', 'another')}></button>
    </div>
  );
}
