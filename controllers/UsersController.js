import dbClient from '../utils/db';

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
        const newUser = dbClient.users.insertOne({ email, password: hashedPassword });
        res.send(201).send({ id: newUser.insertedId, email });
      }
    }
  }
}
