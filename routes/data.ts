import express from 'express';
import RedisService from '../services/Redis.service';
import Helper from '../services/Helper.service';

export default function(router: express.Router) {

    const redisService = RedisService.getInstance();

    // get all data endpoint
    router.get('/session/:sessionToken/data', async (req, res) => {
        const sessionToken = req.params.sessionToken;
        try {
            let data: any = {};
            const CAs = await redisService.sMembers('session:' + sessionToken + ':data');
            if (CAs) {
                for (let i = 0; i < CAs.length; i++) {
                    const caId: string = CAs[i].substring(CAs[i].lastIndexOf(':') + 1, CAs[i].length);
                    data[caId] = [];
                    const matches = await redisService.sMembers('session:' + sessionToken + ':ca:' + caId);
                    if (matches) {
                        for (let j = 0; j < matches.length; j++) {
                            const match = await redisService.get(matches[i], '.');
                            if (match) {
                                data[caId].push(match);
                            }
                        }
                    }
                }
            }
            if (data) {
                res.json(data);
            } else {
                res.status(404).end('{ "message": "Not found" }');
            }
        } catch(err) {
            console.error(err);
            res.status(500).end('{ "message": "Internal server error" }');
            return;
        };
    });

    // upload data endpoint
    router.post('/session/:sessionToken/data/ca/:caId', async (req, res) => {
        const sessionToken = req.params.sessionToken;
        const caId = req.params.caId;
        const data = req.body;
        const matchId = Helper.makeId(16)
        try {
            await redisService.set('match:' + matchId, '.', data);
            await redisService.sAdd('session:' + sessionToken + ':ca:' + caId, 'match:' + matchId)
            await redisService.sAdd('session:' + sessionToken + ':data', 'session:' + sessionToken + ':ca:' + caId)
        } catch(err) {
            console.error(err);
            res.status(500).end('{ "message": "Internal server error" }');
        };
        res.status(200).end('{ "matchId": "' + matchId + '" }');
    });
}