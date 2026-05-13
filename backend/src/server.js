import "dotenv/config";

import app from "./app.js";
import { connectRedis, disconnectRedis } from "./config/redisConfig.js";

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

await connectRedis();

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await disconnectRedis();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
