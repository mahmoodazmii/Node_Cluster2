const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("./redis");

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate_limit",
  points: 20, // 20 requests
  duration: 60, // 1 minute
  blockDuration: 900, // 15 minutes
});

module.exports = rateLimiter;
