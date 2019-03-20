import React from 'react';
import { convertCoord } from './gameUtil';

const Square = ({ game, row, col, handleSquareClick }) => {
  const squareSize = 599 / game.size;
  const color = (row % 2 !== col % 2) ? '#DEE3E6' : '#8CA2AD';
  const coord = convertCoord([col, row]);
  const stack = game.board[col][row];
  let top = '';
  if (stack.stack.length > 1) top = 'top';
  const valid = stack.validMove ? 'valid' : '';
  const origin = stack === game.moveOrigin ? 'origin' : '';

  const squareStyle = {
    width: squareSize,
    height: squareSize,
    backgroundColor: color,
  };
  const stoneSize = squareSize - (squareSize * 0.4);
  const stoneStyle = {
    width: `${stoneSize}px`,
    height: `${stoneSize}px`,
  };
  const topStackStyle = {
    ...stoneStyle,
    minHeight: stoneSize,
  };
  const selectedSize = stoneSize - (stoneSize * 0.35);
  const selectedStone = {
    width: `${selectedSize}px`,
    height: `${selectedSize}px`,

  };
  const selectedStyle = {
    width: squareSize,
    height: squareSize,
    maxHeight: squareSize,
  };
  const leftMargin = squareSize - (squareSize * 0.12);
  const stackOverflowStyle = {
    marginLeft: `${leftMargin}px`,
  };

  const renderSelected = () => {
    if (coord === game.toMove.coord && game.toMove.stack) {
      return (
        <div className="selected" style={stoneStyle}>
          {game.toMove.stack.map((x, i) =>
             (i === 0 ?
               <div
                 className={`p${x} ${game.toMove.stone} stone top`}
                 style={{ ...stoneStyle, 'z-index': '10' }}
                 key={`${coord}ToMoveTop`}
               />
               : <div
                 className={`p${x} stone captive`}
                 style={
                  {
                    ...stoneStyle,
                    'z-index': `${10 - i}`,
                    'margin-top': '-65%',
                  }}
                 key={`${coord}MoveStack`}
               />))
          }
        </div>
      );
    }
  };

  const renderStones = () => {
    const maxStack = game.size > 6 ? 6 : game.size;
    if (stack.stack.length <= maxStack) {
      return (
        <div
          className={`square ${valid} ${origin}`}
          id={coord}
          style={squareStyle}
          onClick={() => { handleSquareClick(col, row); }}
        >
          {renderSelected()}
          {stack.stack.map((x, i) =>
             (i === 0 ?
               <div className={`p${x} ${stack.stone} stone ${top}`} style={topStackStyle} key={`${coord}TopStone`} />
               : <div className={`p${x} stone captive`} style={{ ...stoneStyle, 'z-index': `${10 - i}` }} key={`${coord}TopStack`} />))
          }
        </div>
      );
    } else if (stack.stack.length > maxStack) {
      const topStack = stack.stack.slice(0, maxStack);
      const rest = stack.stack.slice(maxStack);
      return (
        <div
          className={`square ${coord} ${valid}`}
          style={squareStyle}
          onClick={() => { handleSquareClick(col, row); }}
        >
          {renderSelected()}
          {topStack.map((x, i) =>
             (i === 0 ?
               <div className={`p${x} ${stack.stone} stone ${top}`} style={topStackStyle} key={`${coord}TopStone`} />
               : <div className={`p${x} stone captive`} style={{ ...stoneStyle, 'z-index': `${10 - i}` }} key={`${coord}TopStack`} />))
          }
          <div className="stack-overflow" style={stackOverflowStyle}>
            {rest.map(x => <div className={`p${x} stone overflow-stone`} key={`${coord}Overflow`} />)}
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
