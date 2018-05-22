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
      isLive: true,
      roomId: '',
      timeControl: false,
    }

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleLiveChange = this.handleLiveChange.bind(this);
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

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

  handleLiveChange() {
    this.setState({
      isLive: !this.state.isLive,
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
    const { boardSize, isPrivate, roomId, isLive, timeControl } = this.state;
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
            <Form size={"tiny"} key={"small"}>
              <Form.Group inline label="Board Size">
              <label>Board Size</label>
              <Form.Radio
                label="3x3"
                value="3"
                checked={this.state.boardSize === 3}
                onChange={this.handleBoardSizeChange}
              />
              <Form.Radio
                label="4x4"
                value="4"
                checked={this.state.boardSize === 4}
                onChange={this.handleBoardSizeChange}
              />
              <Form.Radio
                label="5x5"
                value="5"
                checked={this.state.boardSize === 5}
                onChange={this.handleBoardSizeChange}
              />
              <Form.Radio
                label="6x6"
                value="6"
                checked={this.state.boardSize === 6}
                onChange={this.handleBoardSizeChange}
              />
              <Form.Radio
                label="7x7"
                value="7"
                checked={this.state.boardSize === 7}
                onChange={this.handleBoardSizeChange}
              />
              <Form.Radio
                label="8x8"
                value="8"
                checked={this.state.boardSize === 8}
                onChange={this.handleBoardSizeChange}
              />
              </Form.Group>
              <Form.Field
                control={Select}
                placeholder="Time Control"
                label="Time Control"
                options={times}
                onChange={this.handleTimeChange}
              />
              <Form.Field
                control={Checkbox}
                label="Private"
                onChange={this.handlePrivacyChange}
              />
              <Form.Field
                control={Checkbox}
                label="Correspondence"
                onChange={this.handleLiveChange}
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
              onClick={() => this.props.handleCreateGame(boardSize, timeControl, isFriendGame, isPrivate, isLive, roomId)}
            />
          </Modal.Actions>
        </Modal>
    );
  }
}

export default GameSetup;
