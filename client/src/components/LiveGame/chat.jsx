import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      message: "",
      messages: [],
      typing: ""
    };
    var self = this;
    const { socket } = props;
    socket.on("typing", function(data) {
      console.log("receive typiny", data);
      self.setState({ typing: data.author + " is typing..." });
    });

    socket.on("chat", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data], typing: "" });
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      if (this.state.message) {
        const roomID = this.props.location.pathname.split("/").pop();
        console.log("roomId", roomID);

        socket.emit("chat", {
          author: this.props.username,
          message: this.state.message,
          room: roomID
        });
        this.setState({ message: "" });
      }
    };

    this.onEnterPress = e => {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.sendMessage(e);
      }
    };
    this.handleTyping = () => {
      console.log("Iam typing~~~~");
      socket.emit("typing", {
        author: this.props.username
      });
    };
    this.handleTak = ev => {
      const roomID = this.props.location.pathname.split("/").pop();
      console.log("roomId", roomID);
      ev.preventDefault();
      socket.emit("chat", {
        author: this.props.username,
        message: "TAK",
        room: roomID
      });
      this.setState({ message: "" });
    };
  }
  // make chatbox scroll effect
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ block: "end" });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  renderMessages() {
    return this.state.messages.map(message => {
      return (
        <div>
          <div>
            <strong id="username">{message.author}</strong>:
          </div>
          <p className="outputMessage">{message.message}</p>
        </div>
      );
    });
  }

  render() {
    return (
      <div id="chat" className="hvr-curl-top-right ">
        <button onClick={this.handleTak} id="tak">
          Tak
        </button>
        <div id="chat-window">
          <div id="output">
            <div className="MessageContainer">
              <div className="MessagesList">{this.renderMessages()}</div>
              <div
                ref={el => {
                  this.messagesEnd = el;
                }}
              />
            </div>
          </div>
          <div id="feedback">
            <p>
              <em>{this.state.typing}</em>
            </p>
          </div>
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

          <button id="send">Send</button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    username: state.currentUser
  };
};

export default withRouter(connect(mapStateToProps)(Chat));
