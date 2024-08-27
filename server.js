const cluster = require("cluster");
const express = require("express");
const redis = require("redis ");

if (cluster.isMaster) {
  // Create two replica sets
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  const redisClient = redis.createClient();

  // Initialize the rate limiter
  const rateLimiter = new RateLimiter(redisClient, {
    max: 1, // 1 task per second
    duration: 1000, // 1 second
    namespace: "task",
  });

  // Initialize the queue
  const queue = new BullQueue("task-queue", {
    redis: redisClient,
  });

  // Define the route to handle the task
  app.post("/task", async (req, res) => {
    const userId = req.body.userId;
    const task = req.body.task;

    // Check the rate limit for the user ID
    if (!(await rateLimiter.tryReserve(userId))) {
      return res.status(429).send("Rate limit exceeded");
    }

    // Add the task to the queue
    await queue.add(task, {
      userId,
    });

    res.send("Task added to the queue");
  });

  // Process tasks from the queue
  queue.process(async (job) => {
    const userId = job.data.userId;
    const task = job.data.task;

    // Process the task
    console.log(`Processing task ${task} for user ${userId}`);

    // Release the rate limiter
    await rateLimiter.release(userId);
  });

  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}
