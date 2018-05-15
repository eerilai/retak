import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Input,
  Button,
  Header,
  Modal,
  Icon,
  Form,
  Select,
  Transition
} from 'semantic-ui-react';

const GameLink = ({ modalView, changeView, gameType, url, link }) => {
  let urlField;
  let header;
  if (gameType === 'friend') {
    urlField = (
      <Form.Field>
        <label>{url}</label>
      </Form.Field>
    );
    header = 'Click the Link Below';
  } else {
    urlField = null;
    header = 'New Game Created'
  }

  return (
    <Transition animation={"pulse"} duration={100} visible={true}>
      <Modal
        open={modalView === 'GameLink'}
        size={"tiny"}
        closeIcon
        onClose={() => changeView('')}
      >
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Form size={"tiny"} key={"small"} />
          {urlField}
        </Modal.Content>
        <Modal.Actions>
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
    </Transition>
  );
}

export default GameLink;