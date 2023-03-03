import Redis from 'ioredis';
import dotenv from "dotenv"
dotenv.config();


const redisClient = new Redis(`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

redisClient.on('connect', () => {
    console.log(' 🚀  Connected to Redis Cloud');
});

redisClient.on('error', (error) => {
    console.error('❌ Error connecting to Redis Cloud:', error);
});

export default redisClient