import express from 'express';
import bcrypt from 'bcrypt';

export function getAuthorizationMW() {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let authorized = false;
        if (req.headers.authorization && process.env.TOKEN_HASH) {
            const token = req.headers.authorization.substring(7, req.headers.authorization.length);
            await bcrypt.compare(token, process.env.TOKEN_HASH).then((result) => {
                if (result) {
                    next();
                    authorized = true;
                }
            });
        }
        if (!authorized) {
            res.end('{ "message": "Unauthorized" }');
        }
        return;
    }
}