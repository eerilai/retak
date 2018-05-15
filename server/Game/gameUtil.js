const pieceCount = {
  3: { F: 10, C: 0, total: 10 },
  4: { F: 15, C: 0, total: 15 },
  5: { F: 21, C: 1, total: 22 },
  6: { F: 30, C: 1, total: 31 },
  7: { F: 40, C: 2, total: 42 },
  8: { F: 50, C: 2, total: 52 },
};

const convertCoord = (square) => {
  const a = 'a'.charCodeAt(0);
  if (typeof square === 'string') {
    return [square[0].charCodeAt(0) - a, (1 * square[1]) - 1];
  } else if (Array.isArray(square)) {
    return String.fromCharCode(a + square[0]) + (square[1] + 1);
  }
};

module.exports = {
  pieceCount,
  convertCoord
}