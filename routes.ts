import express from 'express';

export default function(app: express.Application) {
    const router = express.Router();
    // call routes here

    // hello world
    router.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use('/', router);
}