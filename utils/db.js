import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;
    this.connected = false;
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error(err);
        return;
      }
      this.connected = true;
      this.db = client.db(database);
    });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    const coll = this.db.collection('users');
    const count = await coll.countDocuments();
    return count;
  }

  async nbFiles() {
    const coll = this.db.collection('files');
    const count = await coll.countDocuments();
    return count;
  }
}

const dbClient = new DBClient();

export default dbClient;
