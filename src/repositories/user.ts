import { FilterQuery, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { IUser } from '../interfaces/user';
import { RepositoryBase } from "./base";

const config = require("../config");

export class UserModelHandler {
    private _userModel: IUser;

    constructor(_userModel: IUser) {
        this._userModel = _userModel;
    }

    get firstName(): string {
        return this._userModel.firstName ?? '';
    }

    static async create(data: IUser): Promise<IUser> {
        const repo = new UserRepository();
        const user = new UserModel({
            login: data.login,
            password: data.password,
            email: data.email,
            lastName: data.lastName,
            firstName: data.firstName,
            photo: data.photo || '',
        });
        return repo.create(user);
    }

    static async getPublicInfo(_id: Types.ObjectId): Promise<Partial<IUser>> {
        const repo = new UserRepository();
        const user = await repo.findOneWithSelect({ _id }, 'firstName lastName login');

        if (!user) throw new Error('User not found');
        return user;
    }

    static async delete(_id: Types.ObjectId): Promise<boolean> {
        const repo = new UserRepository();
        return repo.delete(_id);
    }

    static async auth(login: string, password: string): Promise<string> {
        const repo = new UserRepository();
        const user = await repo.findOneWithSelect({ login }, 'password');
        if (!user) throw new Error('User not found');

        const isMatch = await repo.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Bad password');

        return jwt.sign({ id: user._id }, config.secretToken, {
            expiresIn: config.TOKEN_EXPIRATION
        });
    }

    static async update(data: Partial<IUser> & { _id: Types.ObjectId }): Promise<IUser | null> {
        const repo = new UserRepository();
        return repo.update(data._id, data);
    }

    static async deleteWithPasswordChecking(password: string, _id: Types.ObjectId): Promise<boolean> {
        const repo = new UserRepository();
        const user = await repo.findOneWithSelect({ _id }, 'password');
        if (!user) throw new Error('User not found');

        const isMatch = await repo.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Bad password');

        return repo.delete(_id);
    }
}

export class UserRepository extends RepositoryBase<IUser> {
    constructor() {
        super(UserModel);
    }

    async findOneWithSelect(conditions: FilterQuery<IUser>, fields: string): Promise<IUser | null> {
        return this.findOne(conditions).then(user => user ? user.toObject() : null);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}