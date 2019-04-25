import AsyncGame from "./models/AsyncGame";
import Game from "./models/Game";
import User from "./models/User";

import UserRepository from "./repositories/User";

import { createConnection } from "typeorm";


const connection = createConnection("default");

export {
    AsyncGame, Game, User, connection, UserRepository
};
