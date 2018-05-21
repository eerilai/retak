import React, { Component } from 'react';
import {
  Button,
  Modal,
  Form,
  Select,
  Checkbox,
} from 'semantic-ui-react';

class GameSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 5,
      isPrivate: false,
      roomId: '',
      timeControl: false,
      timeIncrement: 0
    }

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  handletimeIncrement = e => this.setState({ timeIncrement: e.target.value })

  handleBoardSizeChange(e, { value }) {
    this.setState({
      boardSize: Number(value)
    });
  }

  handlePrivacyChange() {
    this.setState({
      isPrivate: !this.state.isPrivate
    });
  }

  handleTimeChange(e, { value }) {
    if (value === '0') {
      this.setState({
        timeControl: -1,
      });
    } else {
      this.setState({
        timeControl: Number(value) * 60,
      });
    }
  }

  handleRoomIdChange(e, { value }) {
    this.setState({
      roomId: value
    });
  }

  render() {
    const options = [
      { key: '8', text: '8', value: '8' },
      { key: '7', text: '7', value: '7' },
      { key: '6', text: '6', value: '6' },
      { key: '5', text: '5', value: '5' },
      { key: '4', text: '4', value: '4' },
      { key: '3', text: '3', value: '3' },
    ];
    const times = [
      { key: '2', text: '15', value: '15' },
      { key: '3', text: '10', value: '10' },
      { key: '4', text: '5', value: '5' },
      { key: '5', text: '3', value: '3' },
      { key: '6', text: '1', value: '1' },
      { key: '7', text: 'Test', value: '.15' },
    ];
    const isFriendGame = this.props.gameType === 'friend';
    const { boardSize, isPrivate, roomId, timeControl } = this.state;
    return (
      <Modal
        open={this.props.modalView === 'GameSetup'}
        size="tiny"
        onClose={() => this.props.changeView('')}
        dimmer={false}
        closeIcon
      >
        <Modal.Header>GameSetup</Modal.Header>
        <Modal.Content>
          <Form size="tiny" key="small">
            <Form.Field
              control={Select}
              label="Board Size"
              options={options}
              defaultValue={this.state.boardSize}
              placeholder="Board Size"
              onChange={this.handleBoardSizeChange}
            />
            <Form.Field
              control={Select}
              placeholder="Time Control"
              label="Time Control"
              options={times}
              onChange={this.handleTimeChange}
            />
            <div>Time Increment: {this.state.timeIncrement}</div>
            <Form.Input
              type='range'
              min={0} max={10}
              value={this.state.timeIncrement}

              onChange={this.handletimeIncrement}
            />
            <Form.Field
              control={Checkbox}
              label="Private"
              onChange={this.handlePrivacyChange}
            />

            <Form.Input
              type="text"
              label="Room Name"
              placeholder="optional"
              value={this.state.roomId}
              onChange={this.handleRoomIdChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="gamepad"
            size="large"
            labelPosition="right"
            content="New Game"
            onClick={() => this.props.handleCreateGame(boardSize, timeControl, isFriendGame, isPrivate, roomId)}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default GameSetup;
