import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Button,
  Modal,
  Icon,
  Form,
} from 'semantic-ui-react';

class GameLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };
  }

  render() {


    console.log('hello', this.props)
    const { modalView, changeView, gameType, url, link } = this.props;
    let urlField;
    let header;
    if (gameType === "friend") {
      urlField = (
        <div>
          <div>
            <Form.Field>
              <label>{url}</label>
              <CopyToClipboard
                text={url}
                onCopy={() => this.setState({ copied: true })}
              >
                <span>
                  <Icon name="paste" size="large" />
                </span>
              </CopyToClipboard>
            </Form.Field>
          </div>
          <div id="copied">
            {this.state.copied ? 'Copied' : 'Click to copy'}
          </div>
        </div>
      );
      header = 'Send link to a friend then Enter!';
    } else {
      urlField = null;
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
        <Modal.Content>
          <Form size="small" key="small" />
          {urlField}
        </Modal.Content>
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
