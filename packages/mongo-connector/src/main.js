import { MongoClient } from 'mongodb';

export const connect = async (ctx) => {
  const client = new MongoClient(ctx.env.mongo.url);
  const { logger } = ctx;
  try {
    await client.connect();
    await client.db().admin().ping();

    logger.info('Successfully connected to MongoDB');

    const db = client.db();

    ctx.dbs.mongo = {
      client,
      db,
    };
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnect = async (ctx) => {
  const { logger } = ctx;
  if (ctx.dbs.mongo?.client) {
    await ctx.dbs.mongo.client.close();
    logger.info('Disconnected from MongoDB');
  }
};
