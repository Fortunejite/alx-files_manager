import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const sha1 = require('sha1');
const { ObjectId } = require('mongodb'); // Use ObjectId instead of objectId

export default class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email) {
      res.status(400).send({ error: 'Missing email' });
    } else if (!password) {
      res.status(400).send({ error: 'Missing password' });
    } else {
      try {
        const availableUser = await dbClient.users.findOne({ email: { $eq: email } });
        if (availableUser) {
          res.status(400).send({ error: 'Already exist' });
        } else {
          const hashedPassword = sha1(password);
          const newUser = await dbClient.users.insertOne({ email, password: hashedPassword });
          res.status(201).send({ id: newUser.insertedId, email });
        }
      } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
      }
    }
  }

  static async getMe(req, res) {
    const authToken = req.headers['x-token'];

    if (!authToken) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    try {
      const userId = await redisClient.get(`auth_${authToken}`);
      if (userId) {
        const user = await dbClient.users.findOne({ _id: ObjectId(userId) });
        if (user) {
          res.send({ _id: user._id, email: user.email });
        } else {
          res.status(401).send({ error: 'Unauthorized' });
        }
      } else {
        res.status(401).send({ error: 'Unauthorized' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  }
}
