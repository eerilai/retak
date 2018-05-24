import React from 'react';
import './learn.css'
import boardPicture from './board.png'
import pieces from './pieces.jpg'


const Learn = props => (
  <div className="takless">
    <div className="main">
      <h2 className='mainheader'>How To Play The Beautiful Game of Tak</h2>
      <h4 className='header'>Setup </h4>
      <p >Tak is played on a grid board, like a chess board. But unlike most other strategy games, it can be played on several different sized boards. At the beginning of the game the board starts empty. Each player is given the appropriate number of stones for the board size, as listed in the table to the right.</p>
      <h4 className='header'>Starting Play</h4>
      <p>Players alternate turns throughout the game and you must play on your turn. There is no option to pass and you must change the board state on your turn. Tak is played with only orthogonal movement and connection; squares are not connected diagonally and diagonal movement is not possible. </p>
      <p>On each player’s first turn, they will place one of their opponent’s stones flat on any empty square of the board. Play then continues with players manipulating only stones they control</p>
      <h4 className='header' > On Your Turn </h4>
      <p>Each turn you can do one of two things: place a stone, or move stones you control.</p>
      <h5 className='header2'>Placing Stones</h5>
      <p>On your turn you can opt to place a stone from your reserve onto any empty square on the board. There are three stone types that can be placed: Flat Stone – The basic stone, laid flat on it’s face. This is what you use to build your road. Standing Stone​ – The basic stone, but stood up on an edge.</p>
      <p>Also called a wall. This does not count as part of a road, but other stones cannot stack on top of it. Capstone – This is the most powerful piece. It counts, like a flat stone, as part of your road. Other stones can not stack on top of it.  </p>
      <p>The capstone also has the ability to move by itself onto a standing stone and flatten the standing stone into a flat stone. You can flatten both your opponent’s and your own standing stones in this way.</p>

      <h5 className='header2'> Moving Stones </h5>
      <p>The other option on your turn is to move stones that you control. If your stone is on the top of a stack, you control that entire stack. All three stone types (flat, standing, and cap) can be moved, and moving is the only way to create stacks. Stacks do not have a height limitation. </p>
      <p>When moving stacks of stones, you can not move more stones than the size of the edge of the board; this is called the hand size. On a 5×5 board this means you can not pick up more than 5 stones from a stack. On a 6×6 board the hand size is 6, and so on.</p>
      <h5 className='header2'> There are several simple steps to executing a stack move:</h5>
      <p>Pick up any number of stones, up to the hand size for the board you’re playing on. Do not change the order of these stones. Move in a straight line in the direction of your choice – no diagonals and no changing direction. Y</p>
      <p>You must drop at least one stone from the bottom of the stack in your hand on each square you move over. You may not jump over walls or capstones. The capstone may drop by itself onto a standing stone at the end of a move to flatten it.</p>
      <h4 className='header'> Winning</h4>
      <p><strong>A Winning Road</strong>: connect two opposite sides of the board with a road. A road can include a capstone, but can’t include standing stones.</p>
      <p><strong>Double Win</strong>: If a player makes a move that creates a winning road for both players, the active player is the winner. This situation arises rarely, but it’s not impossible.</p>
      <p><strong>Flat Win</strong>: If either player runs out of pieces, or if the board is covered, then the player with the most flatstones wins.</p>

    </div>
    <div>
      <div className='boardPicture'><img src={boardPicture} /></div>
      <div className='piecesPicture'><img src={pieces} /></div>
    </div>

    <div className='table'>

      <table id='learntable'>

        <tr>
          <th>Board Size</th>
          <th>Stones</th>
          <th>Capstones</th>
        </tr>
        <tr>
          <td>3 x 3</td>
          <td>10</td>
          <td>0</td>
        </tr>
        <tr>
          <td>4 x 4</td>
          <td>15</td>
          <td>0</td>
        </tr>
        <tr>
          <td>5 x 5</td>
          <td>21</td>
          <td>1</td>
        </tr>
        <tr>
          <td>6 x 6</td>
          <td>30</td>
          <td>1</td>
        </tr>
        <tr>
          <td>7 x 7</td>
          <td>40</td>
          <td>1-2</td>
        </tr>
        <tr>
          <td>8 x 8</td>
          <td>50</td>
          <td>2</td>
        </tr>
      </table>
    </div>
  </div >
);

export default Learn;
