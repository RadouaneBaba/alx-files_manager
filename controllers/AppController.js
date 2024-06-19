import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const AppController = {
  getStatus: (req, res) => {
    res.json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  },
  getStats: (req, res) => {
    res.json({ users: dbClient.nbUsers(), files: dbClient.nbFiles() });
  },
};

export default AppController;
