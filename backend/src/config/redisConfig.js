import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redisClient = null;
let connectionPromise = null;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        connectTimeout: 2000,
        reconnectStrategy: false,
      },
    });

    redisClient.on("error", (error) => {
      console.warn("Redis error:", error.message);
    });
  }

  return redisClient;
}

export async function connectRedis() {
  const client = getRedisClient();

  if (client.isOpen || client.isReady) {
    return client;
  }

  if (!connectionPromise) {
    connectionPromise = client
      .connect()
      .then(() => {
        console.log("Redis connected");
        return client;
      })
      .catch((error) => {
        console.warn("Redis unavailable:", error.message);
        return null;
      })
      .finally(() => {
        connectionPromise = null;
      });
  }

  return connectionPromise;
}

export function isRedisReady() {
  return Boolean(redisClient?.isReady);
}

export async function disconnectRedis() {
  if (redisClient?.isOpen) {
    await redisClient.quit();
  }
}
