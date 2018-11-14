import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Game } from '../Game';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import Resign from './Resign';
import OfferDraw from './OfferDraw';
import '../../../styles/controlpanel.css';

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
  }

  handleResign(resigning) {
    const { game, updateGame, emit } = this.props;
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
    
  }

  acceptDraw() {

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
  socket: PropTypes.instanceOf(io).isRequired,
};

const mapStateToProps = (state) => {
  return {
    username: state.currentUsername,
    socket: state.socket,
  };
};

export default ControlPanel;
