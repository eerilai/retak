import React from 'react';

const PTN = ({ ptn }) => {
  return (
    <table>
      <colgroup>
        <col className="turn-number" />
        <col className="ptn-ply" span="2" />
      </colgroup>
      {ptn.map((turn, no) => <tr><b>{no}</b>. {turn.map(ply => <td>{ply}</td>)}</tr>)}
    </table>
  );
};

export default PTN;
