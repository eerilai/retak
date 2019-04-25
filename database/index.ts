import AsyncGame from "./models/AsyncGame";
import Game from "./models/Game";
import User from "./models/User";

import UserRepository from "./repositories/User";

import { createConnection, ConnectionManager, Connection, BaseEntity, Repository, ObjectType } from "typeorm";

const defaultConnectionName = "default";

const manager = new ConnectionManager();
(async () => {

    const repo = await getRepo<User, UserRepository>(UserRepository);
})();

async function getRepo<T extends BaseEntity>(): Promise<Repository<T>> {

}
async function getRepo<T extends BaseEntity, U extends Repository<T>>(repoName: ObjectType<U>): Promise<U>;
async function getCustomRepo<T extends BaseEntity>(repoName?: ObjectType<Repository<T>>): Promise<Repository<T>> {
    let conn: Connection = null;
    if (!manager.has(defaultConnectionName)) {
        conn = await createConnection("default");
    } else {
        conn = manager.get(defaultConnectionName);
    }
    let repo: T = null;
}

export {
    AsyncGame, Game, User, connection, UserRepository
};
