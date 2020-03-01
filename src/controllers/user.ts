const config = require("../config");
//Web
import express = require('express');
import mongoose = require('mongoose');
import jwt = require('express-jwt');
//Helpers 
import { Auth } from '../middlewares/auth';
import { UserModel } from "../repositories/user";
import { IUser } from "../interfaces/user";
import randomstring = require("randomstring");

let router = express.Router();

router.post('/user/verifyToken', jwt({ secret: Auth.secretToken }), Auth.verifyToken, () => { });

//Registration
router.post('/', (req, res) => {

    req.checkBody('login', 'Invalid login').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('firstName', 'Invalid firstName');
    req.checkBody('lastName', 'Invalid lastName');

    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            return res.status(400).send({ result: result.array(), isError: true });
        }

        let user = <IUser>{
            login: req.body.login,
            password: req.body.password,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            photo: '',
            money: 0,
            createDate: new Date(),
            activated: false,
            activateCode: randomstring.generate(50),
            passwordRecoveryCode: ''
        };

        UserModel.create(user).then((result) => {
            return res.status(200).send({ result: "OK", 'isError': false, id: result._id });
        });
    });
});

//update
router.put('/', jwt({ secret: Auth.secretToken }), Auth.verifyToken, (req, res) => {
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('firstName', 'Invalid firstName');
    req.checkBody('lastName', 'Invalid lastName');
    req.checkHeaders('user.id', 'Invalid token');

    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            return res.status(400).send({ result: result.array(), isError: true });
        }

        let user = <IUser>{
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            _id: (<any>req).user.id,
        };

        UserModel.update(user).then((result) => {
            return res.status(200).send({ result, 'isError': false });
        }).catch((error) => {
            return res.status(200).send({ result: error, 'isError': true });
        });
    })

});

//delete
router.delete('/', jwt({ secret: Auth.secretToken }), Auth.verifyToken, (req, res) => {
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkHeaders('user.id', 'Invalid token');

    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            return res.status(400).send({ result: result.array(), isError: true });
        }
        UserModel.deleteWithPasswordChecking(req.body.password, (<any>req).user.id).then((result) => {
            return res.status(200).send({ result, 'isError': false });
        }).catch((error) => {
            return res.status(200).send({ result: error, 'isError': true });
        });
    })

});

//Auth
router.post('/auth', (req, res) => {
    req.checkBody('login', 'Invalid login').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            return res.status(400).send({ result: result.array(), isError: true });
        }

        UserModel.auth(req.body.login, req.body.password).then((token) => {
            return res.status(200).send({ token: token, 'isError': false });
        }).catch((error) => {
            return res.status(200).send({ result: error, 'isError': true });
        });
    })
});

//Logout
router.get('/logout', jwt({ secret: config.secretToken }), (req, res) => {
    req.checkHeaders('user.id', 'Invalid token');
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            return res.status(400).send({ result: result.array(), isError: true });
        }

        Auth.expireToken(req.headers);
        return res.status(200).send({ 'isError': false, 'result': true });
    })
});

//Get public info
router.get('/:id', (req, res) => {
    req.checkParams('id', 'Invalid ID param').notEmpty().isObjectId();
    req.getValidationResult().then((result) => {
        if (!result.isEmpty()) {
            return res.status(400).send({ result: result.array(), isError: true });
        }

        UserModel.getPublicInfo(new mongoose.Types.ObjectId(req.params.id)).then((result) => {
            return res.status(200).send({ result: result, 'isError': false });
        }).catch((error) => {
            return res.status(200).send({ result: error, 'isError': true });
        });
    });
});

export = router;

