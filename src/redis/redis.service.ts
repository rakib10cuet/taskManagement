import { Injectable } from '@nestjs/common';
// Redis Call
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  async getRedis(key: string) {
    const redis = new Redis();
    return redis.get(key);
  }

  async setRedis(key: string, value: string) {
    const redis = new Redis();
    return redis.set(key, value);
  }

  async updateRedis(key: string, value: string) {
    const redis = new Redis();
    redis.del(key);
    return redis.set(key, value);
  }
}
