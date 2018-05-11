import React, { Component } from 'react';
import { connect } from 'react-redux';

class LobbyTable extends Component {

  renderLobbyRow(gameData){
// This section is just a templeate and not currently being used.
// It needs to FILLLLED IN once the correct data stucture has been determined.
    const gameId = gameData.gameId;
    const player1 = gameData.players.player1;
    const player2 = gameData.players.player2;
    const gameStatus = gameData.gameStatus;

    return (
      <tr key={gameId} class="tg-row">
        <td>Pinguin {player1}</td>
        <td>Frog {player2}</td>
        <td>Active {gameStatus}</td>
      </tr>
    );
  }

  render() {
    return (
      <div class="tg-wrap"><table id="tg-1ngJI" class="tg">
        <thead>
          <tr>
            <th colSpan="3" class="title">
              <h4>Lobby</h4>
            </th>
          </tr>
          <tr>
            <th class="tg-colName1">Player 1</th>
            <th class="tg-colNames">Player 2</th>
            <th class="tg-colNames">Game Status</th>
          </tr>
        </thead>
        <tbody>
          {/* {this.props.games.map(this.renderLobbyRow)} */}
          <tr class="tg-row">
            <td>Pinguin</td>
            <td>Frog</td>
            <td>Active</td>
          </tr>
          <tr class="tg-row">
            <td>Dog</td>
            <td> Pending </td>
            <td>Waiting</td>
          </tr>
        </tbody>
      </table></div>
    )
  }
}

// This section is just a templeate and not currently being used.
// It needs to FILLLLED IN once the correct data stucture has been determined.
// function mapStateToProps({ games }) {
//   return { games };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({ games }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(LobbyTable);
// export default connect(mapStateToProps)(LobbyTable);
export default LobbyTable;
