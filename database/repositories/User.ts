import { EntityRepository, Repository, Raw, Not, In } from "typeorm";
import { compare } from "bcrypt";
import User from "../models/User";

@EntityRepository(User)
export default class UserRepository extends Repository<User> {

    public async findOrCreate(userProps: Partial<User>) {
        if (!userProps.username) {
            userProps.username = `Tak-user-${Math.random().toString(36).slice(2, 9)}`;
        }
        let user = await this.findOne(userProps);
        if (!user) {
            user = await (Object.assign(new User(), userProps)).save();
        }
        return user;
    }

    public async findOneByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
        const users = await this.find({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
        if (!users || users.length > 1) {
            throw new Error(`Identifier ${usernameOrEmail} did not match any existing users.`);
        }
        return users[0];
    }

    public async authenticateUser(userIdentifier: string, password: string): Promise<User> {
        const user = await this.findOneByUsernameOrEmail(userIdentifier);
        return await UserRepository.comparePasswords(password, user.password) && user;
    }

    /**
     * Compare the provided plaintext password against the salted password.
     * @param password The plaintext password to compare.
     * @param password The salted password to compare.
     */
    private static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        const match = await compare(password, hashedPassword);
        if (!match) {
            throw new Error("The provided password does not match.");
        }
        return match;
    }
}
