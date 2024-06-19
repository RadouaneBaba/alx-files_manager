import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const UsersController = {
  postNew: async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
    const coll = await dbClient.db.collection('users');
    const user = await coll.findOne({ email });
    if (user) return res.status(400).json({ error: 'Already exist' });
    const result = await coll.insertOne({ email, password: sha1(password) });
    return res.status(201).json({ email, id: result.insertedId });
  },
  getMe: async (req, res) => {
    const token = `auth_${req.header('X-Token')}`;
    const userId = await redisClient.get(token);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const coll = await dbClient.db.collection('users');
    const user = await coll.findOne({ _id: ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    return res.json({ id: userId, email: user.email });
  },
};

export default UsersController;
