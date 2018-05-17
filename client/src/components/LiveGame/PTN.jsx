import React, { Component } from 'react';

class PTN extends Component {
  componentDidUpdate() {
    this.autoScroll();
  }

  autoScroll() {
    this.bottom.scrollIntoView({ block: 'end' });
  }

  render() {
    const { ptn } = this.props;
    return (
      <div className="ptn">
        <table className="moves">
          <colgroup>
            <col className="turn-number" />
            <col className="ptn-ply" span="2" />
          </colgroup>
          {ptn.map((turn, no) => <tr>{no + 1} {turn.map(ply => <td>{ply}</td>)}</tr>)}
        </table>
        <div ref={(el) => { this.bottom = el; }} />
      </div>
    );
  }
}

export default PTN;
