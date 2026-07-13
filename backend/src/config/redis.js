// Create the Redis client.
// Export the client.
const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL,
});
client.on("error", (err) => console.error("Redis Error", err));

module.exports = { client };
