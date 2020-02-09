//Web
import express = require('express');
import expressValidator = require('express-validator');
import bodyParser = require('body-parser');
//Db
import mongoose = require('mongoose');
import { DataBase } from './helpers/db';
//Else
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