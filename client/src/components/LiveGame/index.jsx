import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import sound_brick_drop from "./Sounds/brick_drop_concrete.wav";
import Game from "./Game";
import Board from "./Board";
import Stack from "./Stack";
import Chat from "./chat"; // not in use currently
import "../../styles/livegame.css";
import { convertCoord } from "./gameUtil";
import coffee from "./coffee.gif";

class LiveGame extends Component {
  constructor(props) {
    super(props);
    const newGame = new Game(5);
    this.state = {
      game: newGame,
      stone: ""
    };
    this.movePieces = this.movePieces.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCapstone = this.selectCapstone.bind(this);

    const { socket, username } = props;
    const { game } = this.state;
    socket.emit("syncGame", username); // Creates new room if not already in one
    socket.on("playerJoin", (player1, player2) => {
      game.player1 = player1;
      game.player2 = player2;
      game.activePlayer = player1;
    });
    socket.on("updateGame", ({ col, row, stone }) => {
      this.movePieces(col, row, false, stone);
    });

    //Sound Effect
    this.sounds = { brick: sound_brick_drop };
  }

  movePieces(col, row, isPlayerMove, stone = this.state.stone) {
    const { game } = this.state;
    game.selectStack(col, row, stone);
    if (this.state.stone !== "") {
      this.setState({
        stone: ""
      });
    }
    this.setState({
      game
    });

    if (isPlayerMove) {
      this.props.socket.emit("broadcastGameUpdate", {
        col,
        row,
        stone,
        game: game.player1
      });
    }
  }

  handleSquareClick(col, row) {
    if (this.props.username === this.state.game.activePlayer) {
      this.movePieces(col, row, true);
      this.play("brick");
    }
  }

  selectCapstone(stone) {
    if (this.state.game.pieces[this.state.game.toPlay].C > 0) {
      this.setState({
        stone
      });
    }
  }

  toggleStanding() {
    if (this.state.stone === "") {
      this.setState({ stone: "S" });
    } else {
      this.setState({ stone: "" });
    }
  }

  winner() {
    if (this.state.game.winType === "1/2") {
      return <h3>It's a tied! No one wins!</h3>;
    } else if (
      this.state.game.winType === "1/2" &&
      this.state.game.isBoardFull
    ) {
      return (
        <div>
          <h3>
            Board is Full <br />
          </h3>
          <h3>It's a tied! No one wins!</h3>
        </div>
      );
    } else if (this.state.game.winType === "R") {
      return (
        <div>
          <h3>
            Road Complited <br />
          </h3>
          <h3>Player {this.state.game.victor} wins!</h3>
        </div>
      );
    } else if (this.state.game.winType === "F" && this.state.game.isBoardFull) {
      return (
        <div>
          <h3>
            Board is Full <br />
          </h3>
          <h3>Player {this.state.game.victor} wins!</h3>
        </div>
      );
    } else if (this.state.game.winType === "F") {
      return (
        <div>
          <h3>
            A Player Ran Out of Pieces <br />
          </h3>
          <h3>Player {this.state.game.victor} wins!</h3>
        </div>
      );
    } else if (this.state.game.winType !== null) {
      return <h3>Player {this.state.game.victor} wins!</h3>;
    }
  }

  render() {
    const { game, stone } = this.state;
    const { socket } = this.props;

    return (
      <div className="takless">
        <div id="coffee">
          <img src={coffee} width="180px" height="180px" />
        </div>
        <div className="main">
          <div className="game">
            <div className="stone-count">
              White | F({game.pieces[1].F}) / C({game.pieces[1].C}) | Total
              Flats: ({game.p1TotalFlatsCnt})
            </div>

            <br />
            <div className="stone-count">
              Black | F({game.pieces[2].F}) / C({game.pieces[2].C}) | Total
              Flats: ({game.p2TotoalFlatsCnt})
            </div>
            <div>{this.winner()}</div>
            <div className="board">
              <Board game={game} handleSquareClick={this.handleSquareClick} />
            </div>
            <div className="stone-select">
              <div className="active-stone">{stone}</div>
              <button
                className="piece"
                onClick={() => {
                  this.toggleStanding();
                }}
              >
                {stone === "S" ? "F" : "S"}({game.pieces[1].F})
              </button>
              <button
                className="piece"
                onClick={() => {
                  this.selectCapstone("C");
                }}
              >
                C ({game.pieces[1].C})
              </button>
            </div>
          </div>
        </div>
        <Chat socket={socket} />
      </div>
    );
  }

  //play sounds function
  play(src) {
    var sound = new Audio(this.sounds[src]);
    sound.play();
  }
}

const mapStateToProps = state => {
  return {
    username: state.currentUser
  };
};

export default connect(mapStateToProps)(LiveGame);
