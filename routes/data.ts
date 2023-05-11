import express from 'express';
import RedisService from '../services/Redis.service';

export default function(router: express.Router) {

    const redisService = RedisService.getInstance();

    // get data endpoint
    router.get('/session/:sessionToken/data', async (req, res) => {
        const sessionToken = req.params.sessionToken;
        const data = await redisService.get('session:' + sessionToken, '.data');
        if (data) {
            res.json(data);
        } else {
            res.status(404).end('{ "message": "Not found" }');
        }
    });
}