import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from "../interfaces/user";
import randomstring from 'randomstring';

const config = require("../config");

const UserSchema = new mongoose.Schema<IUser>({
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
        unique: true
    },
    firstName: String,
    lastName: String,
    photo: { type: String, default: '' },
    money: { type: Number, default: 0, min: 0 },
    createDate: { type: Date, default: Date.now },
    activated: { type: Boolean, default: false },
    activateCode: { type: String, default: () => randomstring.generate(50) },
    passwordRecoveryCode: { type: String, default: '' }
});

UserSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(config.SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err: any) {
        next(err);
    }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
