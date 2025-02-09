const config = require("../config");
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { createClient } from 'redis';

export class Auth {
    static redisClient = createClient({ url: `redis://localhost:${config.redis_port}` });
    static TOKEN_EXPIRATION_SEC = config.TOKEN_EXPIRATION * 60;
    static secretToken = config.secretToken;

    static async connect() {
        if (!Auth.redisClient.isOpen) {
            await Auth.redisClient.connect();
        }
    }

    static getToken(headers: IncomingHttpHeaders): string {
        const authorization = headers.authorization;
        return authorization?.split(' ')[1] || '';
    }

    static verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = Auth.getToken(req.headers);

        try {
            await Auth.connect();

            const reply = await Auth.redisClient.get(token);

            if (reply) {
                res.sendStatus(401);
                return;
            }

            next();

        } catch (err) {
            console.error("❌ Redis Error:", err);
            res.sendStatus(500);
            return;
        }
    };

    static async expireToken(headers: IncomingHttpHeaders) {
        const token = Auth.getToken(headers);

        if (token) {
            await Auth.connect();
            await Auth.redisClient.set(token, "{ is_expired: true }");
            await Auth.redisClient.expire(token, Auth.TOKEN_EXPIRATION_SEC);
        }
    }
}