import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const AuthController = {
  getConnect: async (req, res) => {
    const auth = req.headers.authorization;
    const cred = Buffer.from(auth.split(' ')[1], 'base64').toString('utf8');
    const email = cred.split(':')[0];
    const password = sha1(cred.split(':')[1]);

    const coll = await dbClient.db.collection('users');
    const user = await coll.findOne({ email, password });

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 3600);
    return res.json({ token });
  },
  getDisconnect: async (req, res) => {
    const token = `auth_${req.headers['x-token']}`;
    const userId = await redisClient.get(token);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(token);

    return res.sendStatus(204);
  },
};

export default AuthController;
