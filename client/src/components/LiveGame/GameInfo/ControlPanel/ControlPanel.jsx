import React, { Component } from 'react';
import { connect } from 'react-redux';
import Game from '../../Game';
import PropTypes from 'prop-types';
import Resign from './Resign';
import OfferDraw from './OfferDraw';
import '../../../../styles/controlpanel.css';

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resigning: false,
      drawOffered: false,
      drawRequested: false,
    };
    this.handleResign = this.handleResign.bind(this);
    this.offerDraw = this.offerDraw.bind(this);
    this.acceptDraw = this.acceptDraw.bind(this);

    const { socket } = props;


    socket.on('receiveDrawOffer', (drawOffered) => {
      console.log('drawOffered');
      this.setState({
        drawOffered
      });
    });
  }

  handleResign(resigning) {
    const { game, updateGame, emit } = this.props;
    if (game.winString){
      return;
    }
    const hasBeganResigning = this.state.resigning;
    if (hasBeganResigning && resigning) {
      game.resign(this.props.username);
      this.setState({
        resigning: false,
      });
      updateGame(game);
    } else if (hasBeganResigning && !resigning) {
      this.setState({
        resigning: false,
      });
    } else {
      this.setState({
        resigning: true,
      });
    }
  }

  offerDraw() {
    const { game } = this.props;
    if (game.winString){
      return;
    }
    console.log('offering draw');
    const { socket, roomId } = this.props;
    this.setState({ drawRequested: true });
    socket.emit('drawOffer', roomId, true);
  }

  acceptDraw() {
    const { game, updateGame } = this.props;
    if (game.winString){
      return;
    }
    game.draw();
    updateGame(game);
    this.setState({ drawOffered: false});
  }

  render() {
    const {
      resigning,
      drawOffered,
      drawRequested,
    } = this.state;
    return (
      <div className="control-panel">
        <tr>
          <OfferDraw
            drawOffered={drawOffered}
            drawRequested={drawRequested}
            offerDraw={this.offerDraw}
            acceptDraw={this.acceptDraw}
          />
          <Resign
            resigning={resigning}
            handleResign={this.handleResign}
          />
        </tr>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  username: PropTypes.string.isRequired,
  game: PropTypes.instanceOf(Game).isRequired,
  updateGame: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    username: state.currentUsername,
    socket: state.socket,
  };
};

export default connect(mapStateToProps)(ControlPanel);
