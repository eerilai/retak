import React, { Component } from 'react';
import Square from './Square';

const Board = (props) => {
  const squares = [];
  let count = 0;
  let color = '';
  for (let row = 0; row < props.game.size; row += 1) {
    for (let col = 0; col < props.game.size; col += 1) {
      color = (row % 2 !== col % 2) ? '#DEE3E6' : '#8CA2AD';
      count += 1;
      squares.push(<Square
        game={props.game}
        row={row}
        col={col}
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
