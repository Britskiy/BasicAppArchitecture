//Web
import express = require('express');
import jwt = require('express-jwt');
import expressValidator = require('express-validator');
import bodyParser = require('body-parser');
//Db
import mongoose = require('mongoose');
import { DataBase } from './helpers/db';
//Else
import async = require('async');
import schedule = require('node-schedule');
import { Auth } from "./middlewares/auth";
const config = require("./config");

let app = express();
DataBase.connect(config);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(expressValidator({
    customValidators: {
        isObjectId: (value) => {
            return mongoose.Types.ObjectId.isValid(value);
        }
    }
}))

app.use(require('./controllers'))

//Run
app.listen(config.app_port, function() {
    console.log('Listening on port ' + config.app_port)
})

export = app;