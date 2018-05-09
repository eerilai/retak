import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messages: [],
      typing: ""
    };

    this.socket = io("localhost:3000");

    var self = this;
    this.socket.on("typing", function(data) {
      self.setState({ typing: data.author + " is typing..." });
    });

    this.socket.on("chat", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data], typing: "" });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit("chat", {
        author: this.props.username,
        message: this.state.message
      });
      this.setState({ message: "" });
    };

    this.handleTyping = () => {
      this.socket.emit("typing", {
        author: this.props.username
      });
    };
  }
  render() {
    return (
      <div id="chat">
        <div id="chat-window">
          <div id="output">
            {this.state.messages.map(message => {
              return (
                <p>
                  <strong>{message.author}</strong>: {message.message}
                </p>
              );
            })}
          </div>
          <div id="feedback">
            <p>
              <em>{this.state.typing}</em>
            </p>
          </div>
        </div>

        <input
          id="handle"
          type="text"
          placeholder="Username"
          value={this.props.username}
          onChange={ev => this.setState({ username: ev.target.value })}
        />

        <input
          id="message"
          type="text"
          placeholder="Message"
          value={this.state.message}
          onKeyPress={this.handleTyping}
          onChange={ev => this.setState({ message: ev.target.value })}
        />

        <button id="send" onClick={this.sendMessage}>
          Send
        </button>
      </div>
    );
  }
}
export default Chat;
