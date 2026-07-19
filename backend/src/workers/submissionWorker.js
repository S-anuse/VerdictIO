const { Worker } = require("bullmq");
const { processSubmission } = require("../services/submissionService");

const submissionWorker = new Worker(
  "submissionQueue",
  async (job) => {
    console.log("Received Job:");
    console.log(job.data);

    await processSubmission(job.data.submissionId);
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  },
);

module.exports = submissionWorker;
// this worker listnes to "submissionQueue" queue
// async (job) => { ... } -> This function runs every time a new job arrives.
// connection; -> Tells the worker how to connect to Redis.
