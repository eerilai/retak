import React from 'react';
import Square from './Square';

const Board = ({ game, handleSquareClick }) => {
  const squares = [];
  for (let row = game.size - 1; row >= 0; row -= 1) {
    for (let col = 0; col < game.size; col += 1) {
      squares.push(<Square
        game={game}
        row={row}
        col={col}
        handleSquareClick={handleSquareClick}
      />);
    }
  }
  return <div className="board">{squares}</div>;
};

export default Board;
