import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const AppController = {
  getStatus: (req, res) => {
    res.json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  },
  getStats: async (req, res) => {
    res.json({ users: await dbClient.nbUsers(), files: await dbClient.nbFiles() });
  },
};

export default AppController;
