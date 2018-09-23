
import * as express from 'express';
import * as mongoose from 'mongoose';
const config = require('../config');

export class DataBase {
    public static connection;
    public static connect(config: any) {
        (<any>mongoose).Promise = global.Promise;

        if (mongoose.connection.readyState == 0) {
            mongoose.set('debug', config.debug);
            mongoose.set('useCreateIndex', true);
            mongoose.set('useNewUrlParser', true);
            this.connection = mongoose.connect(config.mongoDB);
        }
        else
            return this.connection;
    }

    public static debug(debug: any) {
        mongoose.set('debug', debug);
    }
}

DataBase.connect(config);