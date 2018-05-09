import React, { Component } from 'react';
import { convertCoord } from './gameUtil';

const Square = (props) => {
  const coord = convertCoord([props.col, props.row]);
  const squareSize = 599 / props.game.size;
  const style = {
    width: squareSize,
    height: squareSize,
    'background-color': props.color,
    display: 'flex',
    'flex-direction': 'column',
  };
  const percentDecrease = squareSize / 3;
  const stoneSize = `${squareSize - percentDecrease}px`;
  const stoneStyle = {
    width: stoneSize,
    height: stoneSize,
  };
  const spec = {
    position: 'absolute',
    'margin-left': '3px',
    'border-radius': '5px',
    color: '#55656D',
  };
  const percentLeft = squareSize / 8;
  const left = squareSize - percentLeft;
  const smallDivStyle = {
    display: 'flex',
    'flex-direction': 'column',
    position: 'fixed',
    'margin-left': `${left}px`,
  }
  const smallStyle = {
    width: '10px',
    height: '10px',
  };
  const stack = props.game.board[props.col][props.row];
  const renderStones = () => {
    if (stack.stack.length <= 5) {
      return (
        <div style={style}>
          <p style={spec}>{` ${stack.stone} `}</p>
          {stack.stack.map((x, i) => <div className={`p${x} stone`} style={stoneStyle} />)}
        </div>
      );
    } else if (stack.stack.length > 5) {
      const top = stack.stack.slice(0, 5);
      const rest = stack.stack.slice(5);
      return (
        <div style={style}>
          <p style={spec}>{` ${stack.stone} `}</p>
          {top.map((x, i) => <div className={`p${x} stone`} style={stoneStyle} />)}
          <div style={smallDivStyle}>
            {rest.map((x, i) => <div className={`p${x} stone`} style={smallStyle} />)}
          </div>
        </div>
      );
    }
  };
  return (
    <div
      style={style}
      className={coord}
      onClick={() => { props.selectSquare(props.col, props.row); }}
    >
      {renderStones()}
    </div>
  );
};

export default Square;
