import dbClient from '../utils/db';
import sha1 from 'sha1';

const UsersController = {
  postNew: async (req, res) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });  
    const database = process.env.DB_DATABASE || 'files_manager';
    const coll = await dbClient.client.db(database).collection('users');
    const user = await coll.findOne({ email: email });
    if (user) return res.status(400).json({ error: 'Already exist' });
    const result = await coll.insertOne({email: email, password: sha1(password) });
    return res.status(201).json({ email: email, id: result.insertedId });
  },
};

export default UsersController;
