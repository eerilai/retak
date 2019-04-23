import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ schema: "tak", name: "users" })
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({ name: "id" })
    public id: number;

    @Column({ name: "username", type: "text", unique: true })
    public username: string;

    @Column({ name: "username", type: "text" })
    public password: string;

    @Column({ name: "email", type: "text", unique: true })
    public email: string;

    @Column({ name: "googleID", type: "text", unique: true })
    public googleId: string;

    @Column({ name: "facebookID", type: "text", unique: true })
    public facebookId: string;

    @Column({ name: "total_games", type: "int4", default: 0, nullable: false })
    public totalGames: number;

    @Column({ name: "ranked_games", type: "int4", default: 0, nullable: false })
    public rankedGames: number;

    @Column({ name: "ranked_wins", type: "int4", default: 0, nullable: false })
    public rankedWins: number;

    @Column({ name: "ranked_losses", type: "int4", default: 0, nullable: false })
    public rankedLosses: number;

    @CreateDateColumn({ name: "createdAt", type: "time with time zone", nullable: false })
    public created: Date;

    @UpdateDateColumn({ name: "updatedAt", type: "time with time zone", nullable: false })
    public modified: Date;
}

export default User;
