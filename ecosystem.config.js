module.exports = {
  apps: [
    {
      name: "node-api-cluster",
      script: "./server.js",
      instances: 2,
      exec_mode: "cluster",
    },
  ],
};
