import React, { Component } from 'react';

class PTN extends Component {
  componentDidUpdate() {
    this.autoScroll();
  }

  autoScroll() {
    this.bottom.scrollIntoView({ block: 'end' });
  }

  render() {
    const { ptn, victor, winType, full } = this.props;
    const victorColor = victor === 1 ? 'White' : 'Black';
    const loserColor = victor === 1 ? 'Black' : 'White';
    let gameStats = <div/>;

    if (winType) {
      if (winType === 'R') {
        gameStats = (
          <div className="game-stats">
            <strong>Road Complete</strong>
            <p>{`${victorColor} is victorious`}</p>
          </div>
        );
      } else if (winType === 'F' && full) {
        gameStats = (
          <div className="game-stats">
            <strong>Board full</strong>
            <p>{`${victorColor} wins by flats`}</p>
          </div>
        );
      } else if (winType === 'F') {
        gameStats = (
          <div className="game-stats">
            <strong>{`${loserColor} ran out of pieces`}</strong>
            <p>{`${victorColor} wins by flats`}</p>
          </div>
        );
      } else if (winType === 'T') {
        gameStats = (
          <div className="game-stats">
            <strong>Time out</strong>
            <p>{`${victorColor} is victorious`}</p>
          </div>
        );
      } else if (winType === '1') {
        gameStats = (
          <div className="game-stats">
            <strong>{`${loserColor} resigned`}</strong>
            <p>{`${victorColor} is victorious`}</p>
          </div>
        );
      } else if (winType === '1/2') {
        gameStats = (
          <div className="game-stats">
            <strong>Draw</strong>
          </div>
        );
      }
    }
    return (
      <div className="ptn">
        <table className="moves">
          <colgroup>
            <col className="turn-number" />
            <col className="ptn-ply" span="2" />
          </colgroup>
          <tbody>
            {ptn.map((turn, no) => (
              <tr key={`Turn${turn}`}><td>{no + 1}</td>{
                turn.map(ply => <td key={`Ply${ply}`}>{ply}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {gameStats}
        <div ref={(el) => { this.bottom = el; }} />
      </div>
    );
  }
}

export default PTN;
