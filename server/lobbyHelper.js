const filterLobbyList = (roomsObj) => {
  const availableRooms = [];
  for (const roomId in roomsObj) {
    const currentRoom = roomsObj[roomId];
    // console.log('currentRoom in filterLobbyList', currentRoom);
    if (currentRoom.players && !currentRoom.isFriendGame && !(currentRoom.isPrivate && currentRoom.player2) && !currentRoom.isClosed) {
      const pending = currentRoom.players < 2;
      let timeCon;
      if (!currentRoom.isLive) {
        timeCon = 'Correspondence';
      } else {
        timeCon = `${currentRoom.timeControl / 60}+${currentRoom.timeIncrement}`;
      }
      availableRooms.push({
        name: roomId,
        boardSize: currentRoom.boardSize,
        isPending: pending,
        timeControl: timeCon,
        player1: currentRoom.player1,
        player2: currentRoom.player2,
        players: currentRoom.players,
      });
    }
  }
  return availableRooms;
};

module.exports = filterLobbyList;
