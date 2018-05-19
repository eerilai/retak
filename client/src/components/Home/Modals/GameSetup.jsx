import React, { Component } from 'react';
import {
  Input,
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Select,
  Transition,
  Checkbox
} from 'semantic-ui-react';

class GameSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 5,
      isPrivate: false,
      roomId: ''
    }

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
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
      { key: '3', text: '3', value: '3' }
    ];
    const isFriendGame = this.props.gameType === 'friend';
    const { boardSize, isPrivate, roomId } = this.state;
    return (
        <Modal
          open={this.props.modalView === 'GameSetup'}
          size={"tiny"}
          onClose={() => this.props.changeView('')}
          dimmer={false}
          closeIcon
        >
          <Modal.Header>GameSetup</Modal.Header>
          <Modal.Content>
            <Form size={"tiny"} key={"small"}>
              <Form.Field
                control={Select}
                label="Board Size"
                options={options}
                defaultValue={this.state.boardSize}
                placeholder="Board Size"
                onChange={this.handleBoardSizeChange}
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
              onClick={() => this.props.handleCreateGame(boardSize, isFriendGame, isPrivate, roomId)}
            />
          </Modal.Actions>
        </Modal>
    );
  }
}

export default GameSetup;