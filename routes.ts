import express from 'express';
import RedisService from './services/Redis.service';
import cors from 'cors';
import { getAuthorizationMW } from './routes/middlewares';

// routes
import data from './routes/data';

export default function(app: express.Application) {
    const router = express.Router();
    const redisService = RedisService.getInstance();
    redisService.init();

    app.use(cors({
        origin: function(origin, callback) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';

            // allow requests with no origin
            if (!origin) {
                return callback(null, true);
            }
            if (process.env.ALLOWED_ORIGINS) {
                const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
                if (allowedOrigins.indexOf(origin) === -1) {
                    return callback(new Error(msg), false);
                } else {
                    return callback(null, true);
                }
            }
            return callback(new Error(), false);
        },
        credentials: true
    }));

    // middlewares
    const authMW = getAuthorizationMW();

    app.use(authMW);

    // call routes here
    data(router);

    app.use('/', router);
}