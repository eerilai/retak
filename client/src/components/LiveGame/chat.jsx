import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      typing: '',

    };
    const self = this;
    const { socket } = props;
    socket.on('typing', (data) => {
      self.setState({ typing: data.author + ' is typing...' });
      setTimeout(() => { self.setState({ typing: '' }) }, 2000);
    });

    socket.on('chat', (data) => {
      addMessage(data);
      if (this.state.messages.length > 0) {
        this.scrollToBottom()
      }
    });

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data], typing: '' });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      if (this.state.message) {
        const roomID = this.props.location.pathname.split('/').pop();
        socket.emit('chat', {
          author: this.props.username,
          message: this.state.message,
          room: roomID
        });
        this.setState({ message: '' });
      }
    };

    this.onEnterPress = e => {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.sendMessage(e);
      }
    };
    this.handleTyping = () => {
      const roomID = this.props.location.pathname.split('/').pop();
      socket.emit('typing', {
        author: this.props.username,
        room: roomID
      });
    };
    this.handleTak = ev => {
      const roomID = this.props.location.pathname.split('/').pop();
      ev.preventDefault();
      socket.emit('chat', {
        author: '',
        message: `${this.props.username} has called tak`,
        room: roomID
      });
    };
  }




  // make chatbox scroll effect
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ block: 'end' });
  };

  renderMessages() {
    return this.state.messages.map(message => {
      if (message.author) {
        return (
          <div>
            <div>
              <strong id="username">{message.author}</strong>:
            </div>
            <p className="outputMessage">{message.message}</p>
          </div>
        );
      }
      return (
        <div className="systemMessage">
          <p className="outputMessage">{message.message}</p>
        </div>
      )
    });
  }

  render() {
    return (
      <div id="chat">
        <div id="chat-window">
          <div id="output">
            <div className="MessageContainer">
              <div className="MessagesList">{this.renderMessages()}</div>
            </div>
          </div>
          <div id="feedback">
            <p>
              <em>{this.state.typing}</em>
            </p>
          </div>
          <div
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </div>
        <form onSubmit={this.sendMessage}>
          <textarea
            onKeyDown={this.onEnterPress}
            type="text"
            placeholder="Message"
            value={this.state.message}
            onKeyPress={this.handleTyping}
            onChange={ev => this.setState({ message: ev.target.value })}
          />
          <button id="tak" onClick={this.handleTak}>Tak </button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    username: state.currentUsername,
    socket: state.socket
  };
};


export default withRouter(connect(mapStateToProps)(Chat));
