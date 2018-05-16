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
      boardSize: 0,
      isPrivate: false,
    }

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
  }

  handleBoardSizeChange(e, { value }) {
    this.setState({
      boardSize: Number(value)
    });
  }

  handlePrivacyChange(e, { value }) {
    this.setState({
      isPrivate: !this.state.isPrivate
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
                placeholder="Board Size"
                onChange={this.handleBoardSizeChange}
              />
              <Form.Field
                control={Checkbox}
                label="Private"
                onChange={this.handlePrivacyChange}
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
              onClick={() => this.props.handleCreateGame(this.state.boardSize, this.props.gameType === 'friend', this.state.isPrivate)}
            />
          </Modal.Actions>
        </Modal>
    );
  }
}

export default GameSetup;