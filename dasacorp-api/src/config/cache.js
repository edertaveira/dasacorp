const redis = require("redis");
const cacheManager = require("cache-manager");
const redisStore = require("cache-manager-redis-store");

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

const cache = cacheManager.caching("memory", {
  store: redisStore,
  client: redisClient,
  ttl: 60 /* seconds */,
});

module.exports = { cache, redisClient };
