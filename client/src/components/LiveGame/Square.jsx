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
  const stack = props.game.board[props.col][props.row];
  return (
    <div
      style={style}
      className={coord}
      onClick={() => { props.selectSquare(props.col, props.row); }}
    >
      {stack.stone + stack.stack}
    </div>
  );
};

export default Square;
