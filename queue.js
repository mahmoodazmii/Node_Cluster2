const Queue = require("bull");
const redisClient = require("./redis");

const queue = new Queue("taskQueue", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

queue.on("error", (err) => {
  console.error("Queue error:", err);
});

module.exports = queue;
