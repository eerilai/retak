import React, { Component } from "react";

class Lobby extends Component {
  constructor(props) {
    super(props);
    
    console.log('props', props);
    console.log('this.props', this.props);
    this.state = {
      games: {},
      socket: this.props.socket
    };
    console.log('this.state.socket', this.state.socket);
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <table>
        <tr>
          <th>Player</th>
          <th>Mode</th>
        </tr>

        <tr className="room">
          <td>Anonymous</td>

          <td>Casual</td>
        </tr>
      </table>
    );
  }
}

export default Lobby;
