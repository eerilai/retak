const filterLobbyList = (roomsObj) => {
  let availableRooms = [];
  for (let roomId in roomsObj) {
    const currentRoom = roomsObj[roomId];
    console.log('currentRoom in filterLobbyList', currentRoom);
    if (currentRoom.players && !currentRoom.isFriendGame && !(currentRoom.isPrivate && currentRoom.player2) && !currentRoom.isClosed) {
      const pending = currentRoom.players < 2;
      availableRooms.push({ name: roomId, boardSize: currentRoom.boardSize, isPending: pending });
    }
  }
  return availableRooms;
}

module.exports = filterLobbyList;