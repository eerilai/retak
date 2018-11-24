import React from 'react';
import PropTypes from 'prop-types';
import Game from '../Game';
import ControlPanel from './ControlPanel';
import PTN from './PTN';


const formatSeconds = (totalSeconds) => {
  if (totalSeconds === undefined || totalSeconds === null) {
    return '';
  }

  if (totalSeconds === 0) {
    return <div> 00:00 </div>;
  }
  let seconds = totalSeconds % 60;
  let minutes = Math.floor(totalSeconds / 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return <div>{minutes}:{seconds}</div>;
};

const GameInfo = (props) => {
  const {
    game,
    updateGame,
    playerNumber,
    myTime,
    opponentTime,
  } = props;

  let opponentName;
  let playerName;
  let opponentPlayerNumber;
  if (playerNumber === 1) {
    opponentName = game.player2;
    playerName = game.player1;
    opponentPlayerNumber = 2;
  } else {
    opponentName = game.player1;
    playerName = game.player2;
    opponentPlayerNumber = 1;
  }

  let pToPlay;
  let oppToPlay;
  if ((game.toPlay === 1 && playerNumber === 1) ||
     (game.toPlay === 2 && playerNumber === 2)) {
    pToPlay = 'to-play';
    oppToPlay = '';
  } else {
    oppToPlay = 'to-play';
    pToPlay = '';
  }

  if (game.player1 === game.player2) {
    opponentName = 'Waiting for Match...';
  }

  const PlayerPieces = (
    <div className="score">
      <table>
        <tr><td>{`${game.pieces[playerNumber].F} / ${game.pieces[playerNumber].C}`}</td><td>{game[`p${playerNumber}FlatScore`]}</td></tr>
        <tr style={{ 'font-size': '10px' }}><td>Stones</td><td>Score</td></tr>
      </table>
    </div>
  );
  const OpponentPieces = (
    <div className="score">
      <table>
        <tr style={{ 'font-size': '10px' }}><td>Stones</td><td>Score</td></tr>
        <tr><td>{`${game.pieces[opponentPlayerNumber].F} / ${game.pieces[opponentPlayerNumber].C}`}</td><td>{game[`p${opponentPlayerNumber}FlatScore`]}</td></tr>
      </table>
    </div>
  );

  return (
    <div className="game-info">
      <div className={`timer ${oppToPlay}`} style={{ 'border-bottom':'0' }}>
        {formatSeconds(opponentTime)}
      </div>
      <table>
        {OpponentPieces}
        <tr>{opponentName}</tr>
        <PTN ptn={game.ptn} victor={game.victor} winType={game.winType} full={game.isBoardFull}/>
        <ControlPanel game={game} updateGame={updateGame} />
        <tr>{playerName}</tr>
        {PlayerPieces}
      </table>
      <div className={`timer ${pToPlay}`}style={{ 'border-top': '0' }}>
        {formatSeconds(myTime)}
      </div>
    </div>
  );
};

GameInfo.propTypes = {
  game: PropTypes.instanceOf(Game).isRequired,
  updateGame: PropTypes.func.isRequired,
  playerNumber: PropTypes.number.isRequired,
  myTime: PropTypes.number.isRequired,
  opponentTime: PropTypes.number.isRequired,
};

export default GameInfo;
