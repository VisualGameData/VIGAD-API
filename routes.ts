import express from 'express';
import RedisService from './services/Redis.service';
import { getAuthorizationMW } from './routes/middlewares';

// routes
import data from './routes/data';

export default function(app: express.Application) {
    const router = express.Router();
    const redisService = RedisService.getInstance();
    redisService.init();

    // middlewares
    const authMW = getAuthorizationMW();

    app.use(authMW);

    // call routes here
    data(router);

    app.use('/', router);
}