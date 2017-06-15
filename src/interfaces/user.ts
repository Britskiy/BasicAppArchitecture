import express = require('express');
import mongoose = require('mongoose');

import Schema = mongoose.Schema;
import Types = mongoose.Types;
import ObjectId = Types.ObjectId;

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
