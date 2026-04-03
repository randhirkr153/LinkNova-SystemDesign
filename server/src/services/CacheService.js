const { createClient } = require('redis');

class CacheService {
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => console.error('Redis Client Error:', err));
    this.client.on('connect', () => console.log('Redis Client Connected'));
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async getUrl(shortUrl) {
    try {
      return await this.client.get(`url:${shortUrl}`);
    } catch (error) {
      console.error('Redis GET Error:', error);
      return null;
    }
  }

  async setUrl(shortUrl, longUrl) {
    try {
      // Cache the URL for 24 hours (86400 seconds)
      await this.client.setEx(`url:${shortUrl}`, 86400, longUrl);
    } catch (error) {
      console.error('Redis SET Error:', error);
    }
  }
}

module.exports = new CacheService();
