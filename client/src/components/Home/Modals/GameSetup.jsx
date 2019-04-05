import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal, Form, Checkbox } from 'semantic-ui-react';
import MyModal from '../../Util/Modal';
import './GameSetup.scss';
import generateRoomName from '../roomNames';

class GameSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 5,
      isPrivate: false,
      isLive: true,
      roomId: '',
      timeControl: 15,
      timeIncrement: 0,
      color: 'random',
    };
    this.defaultRoomName = generateRoomName();
    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleLiveChange = this.handleLiveChange.bind(this);
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  handleTimeControl(e) {
    this.setState({ timeControl: e.target.value });
  }

  handleTimeIncrement(e) {
    this.setState({ timeIncrement: e.target.value });
  }

  handleBoardSizeChange(e, { value }) {
    this.setState({
      boardSize: Number(value),
    });
  }

  handlePrivacyChange() {
    this.setState({
      isPrivate: !this.state.isPrivate,
    });
  }

  handleColorChange(e, { value }) {
    this.setState({
      color: value,
    });
  }

  handleRoomIdChange(e, { value }) {
    this.setState({
      roomId: value,
    });
  }

  handleLiveChange(e, { value }) {
    if (!value) {
      this.setState({
        isLive: false,
        timeControl: 0,
      });
    } else {
      this.setState({
        isLive: true,
        timeControl: 15,
      });
    }
  }

  render() {
    const isFriendGame = this.props.gameType === 'friend';
    const { boardSize, isPrivate, roomId, timeControl, isLive, timeIncrement, color } = this.state;
    const timeOptions = [
      { text: 'Real Time', value: true },
      { text: 'Correspondence', value: false, disabled: !this.props.isLoggedIn },
    ];
    const boardSizeOptions = [
      { text: '3x3', value: 3 },
      { text: '4x4', value: 4 },
      { text: '5x5', value: 5 },
      { text: '6x6', value: 6 },
      { text: '7x7', value: 7 },
      { text: '8x8', value: 8 },
    ];
    const timeSliders = this.state.isLive ?
      (
        <div>
          <span><strong>Minutes per side</strong>: {this.state.timeControl} minute(s)</span>
          <input
            className="slider" type="range" min={0} max={90} value={this.state.timeControl}
            onChange={this.handleTimeControl}
          />
          <span><strong>Increment in seconds</strong>: {this.state.timeIncrement} second(s)</span>
          <input
            className="slider" type="range" min={0} max={30} value={this.state.timeIncrement}
            onChange={this.handleTimeIncrement}
          />
        </div>
      ) : <div />;

    return (
      <MyModal
        mountTo="game-list-modal-hook"
        setView={this.props.changeView}
        isOpen={this.props.modalView === 'GameSetup'}
      >
        <Modal.Header>
          <Form.Input
            type="text"
            placeholder={`Room Name (${this.defaultRoomName})`}
            value={this.state.roomId}
            onChange={this.handleRoomIdChange}
          />
          <Form.Field
            id="checkbox-allow-spectators"
            control={Checkbox}
            onChange={this.handlePrivacyChange}
          />
          <label>Allow Spectators</label>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <label>Board Size</label>
            <Form.Dropdown
              selection
              value={this.state.boardSize}
              options={boardSizeOptions}
              onChange={this.handleBoardSizeChange}
            />
            <label>Time Control</label>
            <Form.Dropdown
              selection
              value={this.state.isLive}
              options={timeOptions}
              onChange={this.handleLiveChange}
            />
            {timeSliders}
            <br />
            <Form.Group inline label="Board Size" style={{ justifyContent: 'center' }}>
              <Form.Radio
                label="White"
                value="white"
                checked={this.state.color === 'white'}
                onChange={this.handleColorChange}
              />
              <Form.Radio
                label="Random"
                value="random"
                checked={this.state.color === 'random'}
                onChange={this.handleColorChange}
              />
              <Form.Radio
                label="Black"
                value="black"
                checked={this.state.color === 'black'}
                onChange={this.handleColorChange}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            content="Create Game"
            onClick={() => {
              const roomName = this.state.roomId === '' ? this.defaultRoomName : this.state.roomId;
              this.props.handleCreateGame(boardSize, timeControl, timeIncrement,
                isFriendGame, isPrivate, isLive, roomName, color)
            }}
          />

        </Modal.Actions>
      </MyModal>
    );
  }
}

GameSetup.propTypes = {
  gameType: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleCreateGame: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  modalView: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(GameSetup);
