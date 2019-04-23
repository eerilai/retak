import { Entity, Column } from "typeorm";
import Game from "./Game";

@Entity({ schema: "tak", name: "games" })
export class AsyncGame extends Game {

    @Column({ name: "room_id", type: "text" })
    public roomId: string;

    @Column({ name: "active_player", type: "text" })
    public activePlayer: string;
}

export default AsyncGame;
