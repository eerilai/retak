import React from 'react';
import './learn.css';
import Markdown from 'react-markdown';
import { Parallax } from 'react-parallax';

import board from './images/tak-board.png';
import pieces from './images/tak-pieces.png';
import game from './images/tak-game.png';
import game2 from './images/tak-game2.png';

import { default as setup } from './markdown/setup.md';
import { default as startingPlay } from './markdown/starting-play.md';
import { default as turns } from './markdown/turns.md';
import { default as winning } from './markdown/winning.md';

class LearnPage extends React.PureComponent {
  render() {
    return (
      <div className="learn retak">
        <h1 className="parallax-header">How to play the beautiful game of Tak</h1>
        <h1 className="parallax-padding">Setup</h1>
        <Parallax bgImage={board} strength={500}>
          <div className="parallax-content-container">
            <Markdown className="parallax-content" source={setup} />
          </div>
        </Parallax>
        <h1 className="parallax-padding">Starting Play</h1>
        <Parallax bgImage={pieces} strength={600}>
          <div className="parallax-content-container">
            <Markdown className="parallax-content" source={startingPlay} />
          </div>
        </Parallax>
        <h1 className="parallax-padding">Taking Turns</h1>
        <Parallax bgImage={game}>
          <div className="parallax-content-container" style={{ height: 1500 }}>
            <Markdown className="parallax-content" source={turns} />
          </div>
        </Parallax>
        <h1 className="parallax-padding">Winning</h1>
        <Parallax bgImage={game2}>
          <div className="parallax-content-container">
            <Markdown className="parallax-content" source={winning} />
          </div>
        </Parallax>
      </div>
    );
  }
}

export default LearnPage;
