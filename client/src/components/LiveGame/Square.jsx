import React, { Component } from 'react';
import { convertCoord } from './gameUtil';

const Square = (props) => {
  const coord = convertCoord([props.col, props.row]);
  const squareSize = 600 / props.game.size;
  const style = {
    width: squareSize,
    height: squareSize,
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
      {props.game.board[props.col][props.row].stack}
    </div>
  );
};

export default Square;
