import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import User from "./User";

@Entity({ schema: "tak", name: "games" })
export class Game extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    public id: number;

    @Column({ name: "player1", type: "text" })
    public player1Name: string;

    @Column({ name: "player1_id", type: "int4" })
    public player1Id: number;

    @OneToMany(() => User, (user) => user.id, { eager: true, nullable: false, onUpdate: "CASCADE", onDelete: "SET NULL" })
    @JoinColumn({ name: "player1_id", referencedColumnName: "id" })
    public player1: User;

    @Column({ name: "player2", type: "text" })
    public player2Name: string;

    @Column({ name: "player2_id", type: "int4" })
    public player2Id: number;

    @OneToMany(() => User, (user) => user.id, { eager: true, nullable: false, onUpdate: "CASCADE", onDelete: "SET NULL" })
    @JoinColumn({ name: "player2_id", referencedColumnName: "id" })
    public player2: User;

    @Column({ name: "board_state", type: "text" })
    boardState: string;

    @Column({ name: "ptn", type: "text" })
    public position: string;

    @Column({ name: "victor", type: "text" })
    public victor: string;

    @Column({ name: "win_type", type: "text" })
    public winType: string;

    @Column({ name: "board_size", type: "int4" })
    public boardSize: string;

    @Column({ name: "ranked", type: "boolean" })
    public ranked: boolean;

    @CreateDateColumn({ name: "createdAt", type: "time with time zone", nullable: false })
    public created: Date;

    @UpdateDateColumn({ name: "updatedAt", type: "time with time zone", nullable: false })
    public modified: Date;
}

export default Game;
