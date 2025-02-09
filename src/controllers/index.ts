import { ErrorRequestHandler, NextFunction, Request, Response, Router } from "express";
import userRouter from './user';

const router = Router();
router.use('/user', userRouter);

const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token');
        return;
    }

    next(err);
};

router.use(errorHandler);

export default router;
