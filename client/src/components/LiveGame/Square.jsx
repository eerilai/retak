import React, { Component } from 'react';
import { convertCoord } from './gameUtil';

const Square = (props) => {
  const coord = convertCoord([props.col, props.row]);

  const style = {
    width: '120px',
    height: '120px',
    'border-width': '2px',
    'border-color': 'black',
    'background-color': props.color,
  };
  return (
    <div
      style={style}
      className={coord}
      onClick={() => { props.select(props.col, props.row); }}
    >
      {props.game.board[props.col][props.row]}
    </div>
  );
};

export default Square;
