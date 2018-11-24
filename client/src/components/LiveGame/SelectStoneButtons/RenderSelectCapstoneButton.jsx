import React from 'react';
import PropTypes from 'prop-types';
import Game from '../Game';

const RenderSelectCapstoneButton = (props) => {
  const {
    game,
    setStone,
    color,
    stone,
    playerNumber,
  } = props;
  let SelectCapstoneButton = '';
  let capActive = '';
  let capSide = '';
  if (stone === 'C') {
    capActive = 'active-stone';
    capSide = 'piece-selected';
  }


  if (game.pieces[playerNumber].C === 0) {
    SelectCapstoneButton = <div />;
  } else if (game.pieces[playerNumber].C >= 1) {
    const capstones = [];
    for (let i = 0; i < game.pieces[playerNumber].C; i += 1) {
      capstones.push(
        <div
          role="button"
          tabIndex={0}
          className={`${capActive} stone C ${color}`}
          onClick={() => { setStone('C'); }}
          onKeyPress={() => { setStone('C'); }}
        />,
      );
    }
    SelectCapstoneButton = (
      <div className={`cap-select ${capSide}`}>
        {capstones}
      </div>
    );
  }

  return SelectCapstoneButton;
};

RenderSelectCapstoneButton.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  setStone: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  stone: PropTypes.string.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

export default RenderSelectCapstoneButton;
