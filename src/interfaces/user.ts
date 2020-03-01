import mongoose = require('mongoose');

export interface IUser extends mongoose.Document {
    login: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    photo: string;

    money: number,
    createDate: Date;

    activated: boolean;
    activateCode: string;
    passwordRecoveryCode: string;
}
