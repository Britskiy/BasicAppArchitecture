import express = require('express');

import { Auth } from '../middlewares/auth';
import jwt = require('express-jwt');

let _ = require('lodash');
let router = express.Router();

router.use('/user', require('./user'));

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('Invalid token');
    }
});

export = router;
