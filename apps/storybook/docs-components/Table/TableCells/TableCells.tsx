import classes from './TableCells.module.css';

const TableCellColor = (props: { color: string }) => {
  const style = {
    backgroundColor: props.color,
  };

  return (
    <div
      style={style}
      className={classes['table-cell-color']}
    ></div>
  );
};

const TableCellSpace = ({ size }: { size: string | number }) => {
  const style = {
    width: size,
  };

  return (
    <div
      style={style}
      className={classes['table-cell-space']}
    >
      <div className={classes['table-cell-space--inner']}></div>
    </div>
  );
};

const getColor = (type: string) => {
  let color = '';
  if (type === 'string') {
    color = '#ffd7d7';
  } else if (type === 'number') {
    color = '#d0e0fc';
  } else if (type === 'boolean') {
    color = '#d2fdce';
  } else {
    color = '#eaeaea';
  }
  return color;
};

const TableCellTag = (props: { type: string; text: string }) => {
  const style = {
    backgroundColor: getColor(props.type),
  };
  return (
    <div
      style={style}
      className={classes['table-cell-tag']}
    >
      {props.text}
    </div>
  );
};

const TableCellFont = (props: { size: string }) => {
  const style = {
    fontSize: props.size,
  };
  return <div style={style}>The quick brown fox</div>;
};

export { TableCellColor, TableCellSpace, TableCellTag, TableCellFont };
