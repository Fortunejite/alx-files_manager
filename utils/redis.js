const { promisify } = require('util');
const redis = require('redis');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();

    // Handle errors and log them to the console
    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });
  }

  isAlive() {
    try {
    // Check if the Redis client is connectedtry {
      this.client.ping();
      return true;
    } catch (err) {
      return false;
    }
  }

  async get(key) {
    // Convert Redis get method to a promise-based function
    const getAsync = promisify(this.client.get).bind(this.client);

    try {
      // Get the value associated with the given key
      return await getAsync(key);
    } catch (error) {
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      // Set the value with an expiration in seconds
      await this.client.setex(key, duration, value);
    } catch (error) {
      console.error('Redis Set Error:', error);
    }
  }

  async del(key) {
    try {
      // Delete the value associated with the given key
      await this.client.del(key);
    } catch (error) {
      console.error('Redis Delete Error:', error);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
