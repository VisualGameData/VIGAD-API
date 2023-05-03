import { createClient, RedisClientType } from 'redis';

export default class RedisService {
    private static instance: RedisService;
    private host: string;
    private port: number;

    private client: RedisClientType | null;

    private constructor() {
        this.host = process.env.REDIS_HOST!;
        this.port = +process.env.REDIS_PORT!;
        this.client = null;
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }

        return RedisService.instance;
    }

    public async init(): Promise<void> {
        if (!this.client) {
            this.client = createClient({
                url: 'redis://' + this.host + ':' + this.port
            });

            this.client.on('error', (err: any) => {
                console.error('Redis client error: ', err);
                this.client!.disconnect();
                this.client = null;
            });

            await this.client.connect();
        }
    }

    public async end(): Promise<void> {
        if (this.client) {
            await this.client.quit();
        }
    }

    public async get(key:string, path:string) {
        if (this.client) {
            return await this.client!.json.get(key, { path: path });
        }
    }

    public async set(key:string, path:string, value:any) {
        if (this.client) {
            await this.client!.json.set(key, path, value);
        }
    }

    public async del(key:string, path:string) {
        if (this.client) {
            await this.client!.json.del(key, path);
        }
    }
}