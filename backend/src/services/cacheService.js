import { getRedisClient, isRedisReady } from "../config/redisConfig.js";

export async function getCachedJson(key) {
  if (!isRedisReady()) {
    return null;
  }

  try {
    const cachedValue = await getRedisClient().get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
  } catch (error) {
    console.warn(`Redis cache read failed for ${key}:`, error.message);
    return null;
  }
}

export async function setCachedJson(key, value, ttlSeconds = 60) {
  if (!isRedisReady()) {
    return;
  }

  try {
    await getRedisClient().set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.warn(`Redis cache write failed for ${key}:`, error.message);
  }
}

export async function deleteCacheKeys(keys) {
  if (!isRedisReady() || keys.length === 0) {
    return;
  }

  try {
    await getRedisClient().del(keys);
  } catch (error) {
    console.warn("Redis cache delete failed:", error.message);
  }
}
