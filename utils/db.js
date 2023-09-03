const { MongoClient } = require('mongodb');

export default class DBClient {
  constructor() {
    // Create a MongoDB client
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.db = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}/${this.db}`;
    this.client = new MongoClient(this.url);
    // Connect to the MongoDB database
    this.client.connect((err) => {
      if (err) console.log(err);
      // Select the database and collection
      this.db = this.client.db(this.db);
      this.users = this.db.collection('users');
      this.files = this.db.collection('files');
      this.files.files = this.db.collection('fs.files');
      this.files.chunks = this.db.collection('fs.chunks');
    });
  }

  isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbFiles() {
    return this.files.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
