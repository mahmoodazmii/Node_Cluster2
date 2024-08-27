const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("./redis");

const rateLimiterPerSecond = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate_limit_per_second",
  points: 1, // 1 request
  duration: 1, // 1 second
  blockDuration: 0, // no blocking
});

module.exports = rateLimiterPerSecond;
