import React from 'react';
import { convertCoord } from './gameUtil';

const Square = ({ game, row, col, selectSquare }) => {
  const squareSize = 599 / game.size;
  const color = (row % 2 !== col % 2) ? '#DEE3E6' : '#8CA2AD';
  const coord = convertCoord([col, row]);
  const stack = game.board[col][row];

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

  const renderStones = () => {
    if (stack.stack.length <= game.size) {
      return (
        <div className="square" style={squareStyle}>
          <p className="non-flat">{` ${stack.stone} `}</p>
          {stack.stack.map(x => <div className={`p${x} stone`} style={stoneStyle} />)}
        </div>
      );
    } else if (stack.stack.length > game.size) {
      const top = stack.stack.slice(0, game.size);
      const rest = stack.stack.slice(game.size);
      return (
        <div className="square" style={squareStyle}>
          <p className="non-flat">{` ${stack.stone} `}</p>
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
    <div
      style={squareStyle}
      className={`square ${coord}`}
      onClick={() => { selectSquare(col, row, true); }}
    >
      {renderStones()}
    </div>
  );
};

export default Square;
