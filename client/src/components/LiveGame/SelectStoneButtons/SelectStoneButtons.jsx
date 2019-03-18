import React from 'react';
import PropTypes from 'prop-types';
import Game from '../Game';
import RenderSelectCapstoneButton from './RenderSelectCapstoneButton';
import RenderToggleFlatstoneButton from './RenderToggleFlatstoneButton';

const SelectStoneButtons = (props) => {
  const {
    game,
    stone,
    playerNumber,
    setStone,
  } = props;
  const { ptn } = game;

  let color = '';
  let opponentColor = '';
  if (playerNumber === 1) {
    color = 'p1';
    opponentColor = 'p2';
  } else {
    color = 'p2';
    opponentColor = 'p1';
  }

  return (
    <div className="stone-select">
      <RenderSelectCapstoneButton
        game={game}
        setStone={setStone}
        color={color}
        stone={stone}
        playerNumber={playerNumber}
      />
      <RenderToggleFlatstoneButton
        game={game}
        setStone={setStone}
        color={color}
        opponentColor={opponentColor}
        stone={stone}
        playerNumber={playerNumber}
      />
    </div>
  );
};

SelectStoneButtons.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  stone: PropTypes.string.isRequired,
  playerNumber: PropTypes.number.isRequired,
  setStone: PropTypes.func.isRequired,
};

export default SelectStoneButtons;
