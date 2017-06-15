import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
const config = require("../config");
import { IUser } from "../interfaces/user";
let Schema = mongoose.Schema;

//Validation match
let phone_match = [/[\+0-9]+/, "No phone number found ({VALUE})"];
let email_match = [/([a-z0-9_\-\.])+@([a-z0-9_\-\.])+\.([a-z0-9])+/i, "No email found ({VALUE})"];
/**
 * User schema for mangoose
 * @type {Schema}
 */
let User = new Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, match: email_match, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String, default: 'no_image.png' },

    parentId: { type: Schema.Types.ObjectId, ref: 'User', required: false, null: true, default: null },

    money: { type: Number, default: 0, min: 0 },
    //System fields
    createDate: { type: Date, default: Date.now },
    activated: { type: Boolean, default: false },
    activateCode: { type: String, default: '' },
    passwordRecoveryCode: { type: String, default: '' }
});


// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(config.SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            return next();
        });
    });
});

export let userSchemaModel: mongoose.Model<IUser> = mongoose.model<IUser>('User', User);

