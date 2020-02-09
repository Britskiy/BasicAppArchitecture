import express = require('express');
let router = express.Router();

router.use('/user', require('./user'));

router.use((err:any, req:express.Request, res:express.Response, next:void) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('Invalid token');
    }
});

export = router;
