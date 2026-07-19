const { Queue } = require("bullmq");

const submissionQueue = new Queue("submissionQueue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

module.exports = { submissionQueue };
