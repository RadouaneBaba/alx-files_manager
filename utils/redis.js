import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.client.on('error', err => console.log(err));
  }
  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (err) {
      return null;
    }
  }

  async set(key, value, duration) {
    const setexAsync = promisify(this.client.setex).bind(this.client);
    try {
      await setexAsync(key, duration, value);
    } catch (err) {
      return null;
    }
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    try {
      await asyncDel(key);
    } catch(err) {
      return null;
    }
  }
}


const redisClient = new RedisClient();
export default redisClient;
