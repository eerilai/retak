import React from "react";
import Markdown from "react-markdown";
import BoardSizeTable from "./BoardSizeTable";

import "./learn.scss";

import board from "./images/tak-board.png";
import pieces from "./images/tak-pieces.png";
import game from "./images/tak-game.png";
import game2 from "./images/tak-game2.png";

import { default as setup } from "./markdown/setup.md";
import { default as startingPlay } from "./markdown/starting-play.md";
import { default as takingTurns } from "./markdown/taking-turns.md";
import { default as winning } from "./markdown/winning.md";

class LearnPage extends React.PureComponent {
    public render() {
        return (
            <div className="retak learn">
                <BoardSizeTable />
                <div className="main">
                    <h2 className="mainheader">How to play the Beautiful Game of Tak</h2>
                    
                    <h4 className="header">Setup </h4>
                        <Markdown source={setup} />

                    <h4 className="header">Starting Play</h4>
                        <Markdown source={startingPlay} />

                    <h4 className="header" > Taking Turns </h4>
                        <Markdown source={takingTurns} />

                    <h4 className="header"> Winning</h4>
                        <Markdown source={winning} />
                </div>

                <div className="pictures">
                    <img className="picture" style={{ marginTop: "15%" }} src={board} />
                    <img className="picture" style={{ marginTop: "20%" }} src={pieces} />
                    <img className="picture" style={{ marginTop: "20%" }} src={game} />
                    <img className="picture" style={{ marginTop: "20%" }} src={game2} />
                </div>
            </div>
        );
    }
}

export default LearnPage;
