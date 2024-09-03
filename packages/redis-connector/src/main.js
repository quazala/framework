import { createClient } from 'redis';

export const connect = async (ctx) => {
  const { logger } = ctx;
  logger.info('Attempting to connect to Redis');

  try {
    const client = createClient({
      url: ctx.env.redis.url,
      // Add other configuration options as needed
    });

    // Set up event listeners
    client.on('error', (err) => logger.error(`Redis Client Error: ${err}`, 'error'));
    client.on('ready', () => logger.info('Redis Client Ready'));
    client.on('connect', () => logger.info('Redis Client Connected'));
    client.on('reconnecting', () => logger.info('Redis Client Reconnecting'));
    client.on('end', () => logger.info('Redis Client Connection Ended'));

    // Connect to the Redis server
    await client.connect();

    logger.info('Successfully connected to Redis');

    ctx.dbs.redis = {
      client,
    };
  } catch (error) {
    logger.error(`Failed to connect to Redis: ${error.message}`, 'error');
    throw error;
  }
};

export const disconnect = async (ctx) => {
  const { logger } = ctx;
  if (ctx.dbs?.redis?.client) {
    logger.info('Disconnecting from Redis');
    try {
      await ctx.dbs.redis.client.quit();
      logger.info('Successfully disconnected from Redis');
    } catch (error) {
      logger.error(`Error during Redis disconnection: ${error.message}`, 'error');
      throw error;
    }
  } else {
    logger.warn('No active Redis connection to disconnect', 'warn');
  }
};
