import { v4 as uuid4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const sha1 = require('sha1');

export default class AuthController {
  static async getConnect(req, res) {
    let user = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8');
    user = { email: user.split(':')[0], password: sha1(user.split(':')[1]) };
    const availavleUser = await dbClient.users.findOne({
      email: { $eq: user.email },
      password: { $eq: user.password },
    });
    if (!availavleUser) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const token = uuid4();
      await redisClient.set(`auth_${token}`, availavleUser._id, 24 * 60 * 60);
      res.status(200).json({ token });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(token);
    if (userId) {
      await redisClient.del(token);
      res.status(204).send();
    } else {
      res.status(401).send({ error: 'Unauthorized' });
    }
  }
}
