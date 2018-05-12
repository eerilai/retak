import React from 'react';
import { convertCoord } from './gameUtil';

const Square = ({ game, row, col, handleSquareClick }) => {
  const squareSize = 599 / game.size;
  const color = (row % 2 !== col % 2) ? '#DEE3E6' : '#8CA2AD';
  const coord = convertCoord([col, row]);
  const stack = game.board[col][row];
  const valid = stack.validMove ? 'valid' : '';
  const origin = stack === stack.game.moveFrom ? 'origin' : '';

  const squareStyle = {
    width: squareSize,
    height: squareSize,
    'background-color': color,
  };
  const stoneSize = `${squareSize - (squareSize * 0.4)}px`;
  const stoneStyle = {
    width: stoneSize,
    height: stoneSize,
  };
  const leftMargin = squareSize - (squareSize * 0.12);
  const stackOverflowStyle = {
    'margin-left': `${leftMargin}px`,
  };

  const renderSelected = () => {
    if (coord === game.toMove.coord && game.toMove.stack) {
      return (
        <div className="selected">
          {game.toMove.stack.map(x => <div className={`p${x} stone`} style={stoneStyle} />)}
        </div>
      );
    }
  };

  const renderStones = () => {
    if (stack.stack.length <= game.size) {
      return (
        <div
          className={`square ${coord} ${valid} ${origin}`}
          style={squareStyle}
          onClick={() => { handleSquareClick(col, row); }}
        >
          <p className="non-flat">{` ${stack.stone} `}</p>
          {renderSelected()}
          {stack.stack.map(x => <div className={`p${x} stone`} style={stoneStyle} />)}
        </div>
      );
    } else if (stack.stack.length > game.size) {
      const top = stack.stack.slice(0, game.size);
      const rest = stack.stack.slice(game.size);
      return (
        <div
          className={`square ${coord} ${valid}`}
          style={squareStyle}
          onClick={() => { handleSquareClick(col, row); }}
        >
          <p className="non-flat">{` ${stack.stone} `}</p>
          {renderSelected()}
          {top.map(x => <div className={`p${x} stone`} style={stoneStyle} />)}
          <div className="stack-overflow" style={stackOverflowStyle}>
            {rest.map(x => <div className={`p${x} stone overflow-stone`} />)}
          </div>
        </div>
      );
    }
    return <div>Error rendering stones</div>;
  };

  return (
    renderStones()
  );
};

export default Square;
