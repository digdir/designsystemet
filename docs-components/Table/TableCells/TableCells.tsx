import React from 'react';

import classes from './TableCells.module.css';

const TableCellColor = (props: { color: any }) => {
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

const TableCellSpace = (props: { size: any }) => {
  let theSize = '';
  if (
    props.size.toString().includes('px') ||
    props.size.toString().includes('rem')
  ) {
    theSize = props.size;
  } else {
    theSize = props.size * 16 + 'px';
  }

  const style = {
    width: theSize,
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
  return (
    <div
      style={style}
      className={classes['table-cell-font']}
    >
      The quick brown fox
    </div>
  );
};

export { TableCellColor, TableCellSpace, TableCellTag, TableCellFont };
