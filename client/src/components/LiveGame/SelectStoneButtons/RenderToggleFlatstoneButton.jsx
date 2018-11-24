import React from 'react';
import PropTypes from 'prop-types';
import Game from '../Game';
import { Popup } from 'semantic-ui-react';

const RenderToggleFlatstoneButton = (props) => {
  const {
    game,
    setStone,
    color,
    opponentColor,
    stone,
    playerNumber,
  } = props;
  const { ptn } = game;
  let flatActive = '';
  let flatSide = '';
  let SelectStoneButton = '';
  const toggleStanding = () => {
    if (stone === '') {
      setStone('S');
    } else {
      setStone('');
    }
  };
  // If it's the first move, render opposite color first move notification
  if ((playerNumber === 1 && ptn.length === 0) ||
    (playerNumber === 2 && (!ptn[0] || ptn[0].length <= 1))) {
    const firstMoveSelectStoneButton = (
      <div
        role="button"
        tabIndex={0}
        className={`flat-toggle ${flatSide}`}
        onClick={() => { toggleStanding(); }}
        onKeyPress={() => { toggleStanding(); }}
      >
        <div className={`${flatActive} stone ${color}`} >
          <div className={`${flatActive} stone ${opponentColor} ui-overlay first-move-indicator`}>
          !
          </div>
        </div>
        <div className={`inactive stone S ${color}`} />
        <div className="flat-count">{game.pieces[playerNumber].F}</div>
      </div>
    );

    SelectStoneButton = (
      <Popup
        content="Reminder: For your first move you will play a flatstone of your opponents color"
        position="top center"
        size="tiny"
        trigger={
          firstMoveSelectStoneButton
        }
      />
    );
  } else if (stone === 'S') {
    flatSide = 'piece-selected';
    SelectStoneButton = (
      <div
        role="button"
        tabIndex={0}
        className={`flat-toggle ${flatSide}`}
        onClick={() => { toggleStanding(); }}
        onKeyPress={() => { toggleStanding(); }}
      >
        <div className={`active-stone stone S ${color}`} />
        <div className={`inactive stone flat ${color}`} />
        <div className="flat-count">{game.pieces[playerNumber].F}</div>
      </div>
    );
  } else {
    if (stone === '') {
      flatActive = 'active-stone';
      flatSide = 'piece-selected';
    }
    SelectStoneButton = (
      <div
        role="button"
        tabIndex={0}
        className={`flat-toggle ${flatSide}`}
        onClick={() => { toggleStanding(); }}
        onKeyPress={() => { toggleStanding(); }}
      >
        <div className={`${flatActive} stone ${color}`} />
        <div className={`inactive stone S ${color}`} />
        <div className="flat-count">{game.pieces[playerNumber].F}</div>
      </div>
    );
  }

  return SelectStoneButton;
};

RenderToggleFlatstoneButton.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  setStone: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  opponentColor: PropTypes.string.isRequired,
  stone: PropTypes.string.isRequired,
  playerNumber: PropTypes.number.isRequired,
};

export default RenderToggleFlatstoneButton;
