import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(`mongodb://${host}:${port}`);
    this.db = db;
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const coll = this.client.db(this.db).collection('users');
    const count = await coll.countDocuments();
    return count;
  }

  async nbFiles() {
    const coll = this.client.db(this.db).collection('files');
    const count = await coll.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();

export default dbClient;
