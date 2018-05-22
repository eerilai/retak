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
      timeControl: 0,
      timeIncrement: 0
    }

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);

  }

  handleTimeControl = e => { this.setState({ timeControl: e.target.value }) }
  handleTimeIncrement = e => this.setState({ timeIncrement: Number(e.target.value) })

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

    const isFriendGame = this.props.gameType === 'friend';
    const { boardSize, isPrivate, roomId, timeControl } = this.state;
    return (
      <Modal
        open={this.props.modalView === 'GameSetup'}
        size="tiny"

        dimmer={false}

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

            <div><strong>Minutes per side</strong>: {this.state.timeControl} minute(s)</div>
            <input type='range' min={0} max={60} value={this.state.timeControl} onChange={this.handleTimeControl} />
            <div><strong>Increment in seconds</strong>: {this.state.timeIncrement} second(s)</div>
            <input type='range' min={0} max={20} value={this.state.timeIncrement} onChange={this.handleTimeIncrement} />
            <br />
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
            negative
            content="Close"
            onClick={() => this.props.changeView('')}
          />
          <Button
            positive
            content="New Game"
            onClick={() => this.props.handleCreateGame(boardSize, timeControl, isFriendGame, isPrivate, roomId)}
          />

        </Modal.Actions>
      </Modal>
    );
  }
}

export default GameSetup;
