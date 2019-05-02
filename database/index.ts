import AsyncGame from "./models/AsyncGame";
import Game from "./models/Game";
import User from "./models/User";

import UserRepository from "./repositories/User";

import { createConnection, ConnectionManager, Connection, BaseEntity, Repository, Entity } from "typeorm";

const defaultConnectionName = "default";

const manager = new ConnectionManager();

const models = { AsyncGame, Game, User }
export { AsyncGame, Game, User };
const repos = { UserRepository }

async function getConnection(): Promise<Connection> {
    let conn: Connection = null;
    if (!manager.has(defaultConnectionName)) {
        conn = await createConnection("default");
    } else {
        conn = manager.get(defaultConnectionName);
    }
    return conn;
}

export async function getRepo<User>(entity: "User"): Promise<User>;
export async function getRepo<AsyncGame>(entity: "AsyncGame"): Promise<AsyncGame>;
export async function getRepo<Game>(entity: "Game"): Promise<Game>;
export async function getRepo<T extends BaseEntity>(entity: keyof typeof models): Promise<Repository<T>> {
    const conn = await getConnection();
    return await conn.getRepository<T>(models[entity])
}

export async function getCustomRepo(repo: "UserRepository"): Promise<UserRepository>;
export async function getCustomRepo(repo: keyof typeof repos): Promise<Repository<BaseEntity>> {
    const conn = await getConnection();
    return await conn.getCustomRepository(repos[repo]);;
}
