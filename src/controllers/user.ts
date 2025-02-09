import express, { NextFunction, Request, Response } from 'express';
import { expressjwt } from 'express-jwt';
import { body, param, validationResult } from 'express-validator';
import { Auth } from '../middlewares/auth';
import randomstring from "randomstring";
import { UserModelHandler } from "../repositories/user";
import mongoose from 'mongoose';
import { IUser } from '../interfaces/user';

const router = express.Router();

router.get(
    '/ping',
    (req: Request, res: Response) => {
        res.status(200).json({'ping': 'pong'});
    }
)

router.post(
    '/verifyToken',
    expressjwt({ secret: Auth.secretToken, algorithms: ['HS256'] }),
    Auth.verifyToken,
    (req: Request, res: Response) => {
        res.status(200).json({ isValid: true });
    }
);

router.post(
    '/',
    [
        body('login').notEmpty().withMessage('Invalid login'),
        body('password').notEmpty().withMessage('Invalid password'),
        body('email').isEmail().withMessage('Invalid email'),
        body('firstName').optional(),
        body('lastName').optional()
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array(), isError: true });
                return;
            }

            const user = await UserModelHandler.create(<IUser>{
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
            });

            res.status(200).json({
                result: "OK",
                isError: false,
                _id: user._id
            });

        } catch (error) {
            next(error);
        }
    }
);

router.put(
    '/',
    expressjwt({ secret: Auth.secretToken, algorithms: ['HS256'] }),
    Auth.verifyToken,
    [
        body('password').notEmpty().withMessage('Invalid password'),
        body('email').notEmpty().withMessage('Invalid email'),
        body('firstName').optional(),
        body('lastName').optional(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).auth.id;
            if (!userId) {
                res.status(400).json({ message: "Invalid token", isError: true });
                return;
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array(), isError: true });
                return;
            }

            const user = {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                _id: (req as any).auth.id
            };

            const result = await UserModelHandler.update(user);
            res.status(200).json({ result, isError: false });
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    '/',
    expressjwt({ secret: Auth.secretToken, algorithms: ['HS256'] }),
    Auth.verifyToken,
    [
        body('password').notEmpty().withMessage('Invalid password'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).auth.id;
            if (!userId) {
                res.status(400).json({ message: "Invalid token", isError: true });
                return;
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array(), isError: true });
                return;
            }

            const result = await UserModelHandler.deleteWithPasswordChecking(req.body.password, (req as any).auth.id);
            res.status(200).json({ result, isError: false });
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/auth',
    [
        body('login').notEmpty().withMessage('Invalid login'),
        body('password').notEmpty().withMessage('Invalid password')
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array(), isError: true });
                return;
            }

            const token = await UserModelHandler.auth(req.body.login, req.body.password);
            res.status(200).json({ token, isError: false });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/logout',
    expressjwt({ secret: Auth.secretToken, algorithms: ['HS256'] }),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).auth.id;
            if (!userId) {
                res.status(400).json({ message: "Invalid token", isError: true });
                return;
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array(), isError: true });
                return;
            }

            Auth.expireToken(req.headers);
            res.status(200).json({ isError: false, result: true });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/:id',
    [
        param('id').notEmpty().withMessage('Invalid ID param').isMongoId().withMessage('Invalid ObjectId')
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array(), isError: true });
                return;
            }

            const result = await UserModelHandler.getPublicInfo(new mongoose.Types.ObjectId(req.params.id));
            res.status(200).json({ result, isError: false });
        } catch (error) {
            next(error);
        }
    }
);

export default router;