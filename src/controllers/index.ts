import { Request, Response, Router } from "express";

declare module 'express-serve-static-core' {
    interface Response {
        error: (code: number, message: string) => Response;
        success: (code: number, message: string, result: any) => Response
    }
}

let router = Router();

router.use('/user', require('./user'));

router.use((err:any, req:Request, res:Response) => {
    const body = req.body;
    console.log(body);
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('Invalid token');
    }
});

export = router;
