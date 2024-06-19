import dbClient from '../utils/db';
import sha1 from 'sha1';

const UsersController = {
  postNew: async (req, res) => {
    if (!req.body.includes(email)) res.status(400).json({ error: 'Missing email' });
    if (!req.body.includes(password)) res.status(400).json({ error: 'Missing password' });  
    const email = req.body.email;
    const password = sha1(req.body.password);
    const database = process.env.DB_DATABASE || 'files_manager';
    const coll = dbClient.client.db(database).collection('users');
    if (coll.find({ email: email })) res.status(400).json({ error: 'Already exist' });
    const result = await coll.insertOne({email: email, password: password });
    res.status(201).json({ email: email, id: result.insertedId });
  },
};

export default UsersController;
