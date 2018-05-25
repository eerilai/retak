import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from "react-copy-to-clipboard";

import {
  Button,
  Modal,
  Icon,
  Form,
  Image

} from 'semantic-ui-react';

class GameLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  render() {
    const { modalView, changeView, gameType, url, link, boardSize, color,
      timeControl,
      timeIncrement,
      isPrivate,
      isLive } = this.props;
    let urlLink;
    let urlField;
    let header;
    let privateStatus, liveStatus
    if (isPrivate === true) {
      privateStatus = 'Yes'
    } else {
      privateStatus = 'No'
    }
    if (isLive === true) {
      liveStatus = 'No'
    } else {
      liveStatus = 'Yes'
    }
    urlField = <div id='gameMenu'>
      <div> <Icon name='check square' /><strong>BoardSize</strong>: {boardSize} x {boardSize}</div>
      <div> <Icon name='check square' /><strong>Minutes per side</strong>: {timeControl} minute(s)</div>
      <div> <Icon name='check square' /><strong>Increment in seconds</strong>: {timeIncrement} second(s)</div>
      <div> <Icon name='check square' /><strong>Color</strong>: {color}</div>
      <div> <Icon name='check square' /><strong>Private</strong>: {privateStatus}</div>
      <div> <Icon name='check square' /><strong>Correspondence</strong>: {liveStatus}</div>
    </div>;
    if (gameType === "friend") {
      urlLink = (
        <div>
          <div className='gamelink'>
            <div id='linkurl'>{url}</div>
            <div id='clip'>
              <div >
                <CopyToClipboard
                  text={url}
                  onCopy={() => this.setState({ copied: true })}
                >
                  <span>
                    <Icon name="paste" size="large" />
                  </span>
                </CopyToClipboard>

              </div>
              <div id="copied">
                {this.state.copied ? 'Copied' : 'Click to copy'}
              </div>
            </div>
          </div>
          {urlField}
        </div>
      );
      header = 'Send link to a friend then Enter!';
    } else {
      urlLink = urlField
      header = 'New Game Created';
    }

    return (
      <Modal
        open={modalView === 'GameLink'}
        size="medium"
        dimmer={false}
        onClose={() => changeView('')}
        closeIcon
      >
        <Modal.Header>{header}</Modal.Header>

        {urlLink}

        <Modal.Actions>
          <Button
            negative
            content="Close"
            onClick={() => changeView('')}
          />
          <Link to={link}>
            <Button
              positive
              icon="gamepad"
              size="large"
              labelPosition="right"
              content="Enter my room"
            />
          </Link>

        </Modal.Actions>
      </Modal>
    );
  }
}

export default GameLink;
