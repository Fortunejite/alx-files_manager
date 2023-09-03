import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const sha1 = require('sha1');

export default class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email) {
      res.status(400).send({ error: 'Missing email' });
    } else if (!password) {
      res.status(400).send({ error: 'Missing password' });
    } else {
      const availavleUser = await dbClient.users.findOne({ email: { $eq: email } });
      if (availavleUser) {
        res.status(400).send({ error: 'Already exist' });
      } else {
        const hashedPassword = sha1(password);
        const newUser = await dbClient.users.insertOne({ email, password: hashedPassword });
        res.status(201).send({ id: newUser.insertedId, email });
      }
    }
  }

  static async getMe(req, res) {
    const userId = await redisClient.get(req.headers['x-token']);
    if (userId) {
      const user = await dbClient.users.findOne({ _id: { $eq: userId } });
      if (user) {
        res.send({ _id: user._id, email: user.email });
      } else {
        res.status(401).send({ error: 'Unauthorized' });
      }
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  }
}
