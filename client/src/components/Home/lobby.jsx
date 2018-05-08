import React, { Component } from "react";

class Lobby extends Component {
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
