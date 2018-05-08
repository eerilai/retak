class Stack {
  constructor(player = 0) {
    this.stone = '';
    this.owner = player;
    this.stack = [];
    this.isOccupied = player !== 0;
  }

  place(player, stone = '') {
    this.stack.unshift(player);
    this.stone = stone;
    this.owner = player;
    this.isOccupied = true;
  }
}

export default Stack;
