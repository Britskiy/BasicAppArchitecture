import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    login: string;
    password: string;
    email: string;
    firstName?: string;
    lastName?: string;
    photo: string;
    money: number;
    createDate: Date;
    activated: boolean;
    activateCode: string;
    passwordRecoveryCode: string;

    save: () => Promise<this>;
}