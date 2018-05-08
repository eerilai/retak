import React, { Component } from 'react';
import Square from './Square';

const Board = (props) => {
  const squares = [];
  let count = 0;
  let color = '';
  for (let i = 0; i < props.game.size; i += 1) {
    for (let j = 0; j < props.game.size; j += 1) {
      if (count % 2 === 0) {
        color = '#DEE3E6';
      } else {
        color = '#8CA2AD';
      }
      count += 1;
      squares.push(<Square
        game={props.game}
        row={i}
        col={j}
        color={color}
        selectSquare={props.selectSquare}
      />);
    }
  }
  const style = {
    width: '600px',
    height: '600px',
    display: 'flex',
    'flex-direction': 'row',
    'flex-wrap': 'wrap',
  };
  return <div style={style}>{squares}</div>;
};

export default Board;
