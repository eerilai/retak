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
      timeControl: 15,
      timeIncrement: 0,
      color: 'random',
    }

    this.handleBoardSizeChange = this.handleBoardSizeChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleLiveChange = this.handleLiveChange.bind(this);
    this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);

  }

  handleTimeControl = e => this.setState({ timeControl: e.target.value })
  handleTimeIncrement = e => this.setState({ timeIncrement: e.target.value })

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

  handleColorChange(e, { value }) {
    this.setState({
      color: value,
    });
  }

  handleRoomIdChange(e, { value }) {
    this.setState({
      roomId: value
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
      })
    }
  }

  render() {
    const isFriendGame = this.props.gameType === 'friend';
    const { boardSize, isPrivate, roomId, timeControl, isLive, timeIncrement, color} = this.state;
    
    const timeOptions = [
      { text: 'Real Time', value: true },
      { text: 'Correspondence', value: false},
    ]
    const timeSliders = this.state.isLive ? 
    ( <div>
      <div><strong>Minutes per side</strong>: {this.state.timeControl} minute(s)</div>
      <input className='slider' type='range' min={0} max={90} value={this.state.timeControl} onChange={this.handleTimeControl} />
      <div><strong>Increment in seconds</strong>: {this.state.timeIncrement} second(s)</div>
      <input className='slider' type='range' min={0} max={30} value={this.state.timeIncrement} onChange={this.handleTimeIncrement} />
      </div>
    ) : <div></div>

    return (
      <Modal
        open={this.props.modalView === 'GameSetup'}
        //size="small"
        dimmer={false}

      >
        <Modal.Header style={{ display: 'flex'}}>
          GameSetup
          <Form.Input
            style={{ height: '30px', 'margin-left': '50%', width: '65%'}}
            type="text"
            placeholder="Name Room?"
            value={this.state.roomId}
            onChange={this.handleRoomIdChange}
          />
        </Modal.Header>
        <Modal.Content>
          <Form >
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
            <Form.Dropdown
              selection
              style={{ width: '10%' }}
              label="Time Control"
              value={this.state.isLive}
              options={timeOptions}
              onChange={this.handleLiveChange}
            />
            {timeSliders}
            <br />
            <Form.Field
              control={Checkbox}
              label="Private"
              onChange={this.handlePrivacyChange}
            />
            <Form.Group inline label="Board Size" style={{ 'justify-content': 'center'}}>
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
            negative
            content="Close"
            onClick={() => this.props.changeView('')}
          />
          <Button
            positive
            content="New Game"
            onClick={() => this.props.handleCreateGame(boardSize, timeControl, timeIncrement, isFriendGame, isPrivate, isLive, roomId, color)}
          />

        </Modal.Actions>
      </Modal>
    );
  }
}

export default GameSetup;
