class Stack {
  constructor(player = 0) {
    this.stone = '';
    this.owner = player;
    this.stack = [];
    player === 0 ? this.isOccupied = false : this.isOccupied = true;
  }

  place(player, stone) {
    this.stack.push(player);
    this.stone = stone;
    this.owner = player;
    this.isOccupied = true;
  }
}

export default Stack;
