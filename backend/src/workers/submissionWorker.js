require("dotenv").config();

const { Worker } = require("bullmq");
const { processSubmission } = require("../services/submissionService");

const submissionWorker = new Worker(
  "submissionQueue",
  async (job) => {
    console.log("Received job:", job.data);

    await processSubmission(job.data.submissionId);
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

// Log when a queued submission has been processed successfully.
submissionWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

// Log jobs that fail during processing.
submissionWorker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed:`,
    error
  );
});

// Handle worker-level errors.
submissionWorker.on("error", (error) => {
  console.error("Worker error:", error);
});

module.exports = submissionWorker;