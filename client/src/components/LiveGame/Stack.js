class Stack {
  constructor(player = 0) {
    this.top;
    this.owner = player;
    this.stack = [player || ''];
    player === 0 ? this.isOccupied = false : this.isOccupied = true;
  }
}

export default Stack;
