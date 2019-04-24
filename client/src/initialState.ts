import socketIOClient from "socket.io-client";
import generateCharacterName from "./components/characterName";

export interface ReduxState {
    isLoggedIn: boolean;
    userID: number;
    currentUsername: string;
    userEmail: string;
    rankedGames: number;
    rankedWins: number;
    rankedLosses: number;
    totalGames: number;
    avatar: string;
    socket: SocketIOClient.Socket;
    games: any[];
}

const initialState: ReduxState = {
    isLoggedIn: false,
    userID: null,
    currentUsername: generateCharacterName(),
    userEmail: null,
    rankedGames: null,
    rankedWins: null,
    rankedLosses: null,
    totalGames: null,
    avatar: null,
    socket: socketIOClient(undefined, { forceNew: true }),
    games: [],
};

export default initialState;