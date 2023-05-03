import express from 'express';
import RedisService from './services/Redis.service';
import { getAuthorizationMW } from './routes/middlewares';

export default function(app: express.Application) {
    const router = express.Router();
    const redisService = RedisService.getInstance();
    redisService.init();

    // middlewares
    const authMW = getAuthorizationMW();

    app.use(authMW);

    // call routes here

    // hello world
    router.get('/', async (req, res) => {
        await redisService.set('test', '.', { abc: 'def' });
        res.send(await redisService.get('test', '.'));
    });

    app.use('/', router);
}