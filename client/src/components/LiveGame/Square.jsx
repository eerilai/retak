import React, { Component } from 'react';
import { convertCoord } from './gameUtil';

class Square extends Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    const coord = convertCoord([this.props.col, this.props.row]);

    const style = {
      width: '120px',
      height: '120px',
      'border-width': '2px',
      'border-color': 'black',
      'background-color': this.props.color,
    };
    return (
      <div style={style} className={coord}>
        {this.props.game.board[this.props.col][this.props.row]}
      </div>
    );
  }
}

export default Square;
