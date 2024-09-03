import amqp from 'amqplib';

export const connect = async (ctx) => {
  const { logger } = ctx;
  logger.info('Attempting to connect to RabbitMQ');

  try {
    const connection = await amqp.connect(ctx.env.rabbitmq.url);
    const channel = await connection.createChannel();

    logger.info('Successfully connected to RabbitMQ');

    ctx.queue.rabbitmq = {
      connection,
      channel,
    };

    // Set up connection error handler
    connection.on('error', (err) => {
      logger.error(`RabbitMQ connection error: ${err.message}`, 'error');
    });

    // Set up connection close handler
    connection.on('close', () => {
      logger.info('RabbitMQ connection closed', 'warn');
    });
  } catch (error) {
    logger.error(`Failed to connect to RabbitMQ: ${error.message}`, 'error');
    throw error;
  }
};

export const disconnect = async (ctx) => {
  const { logger } = ctx;
  if (ctx.queue.rabbitmq) {
    logger.info('Disconnecting from RabbitMQ');
    try {
      if (ctx.queue.rabbitmq.channel) {
        await ctx.queue.rabbitmq.channel.close();
      }
      if (ctx.queue.rabbitmq.connection) {
        await ctx.queue.rabbitmq.connection.close();
      }
      logger.info('Successfully disconnected from RabbitMQ');
    } catch (error) {
      logger.error(`Error during RabbitMQ disconnection: ${error.message}`, 'error');
      throw error;
    }
  } else {
    logger.warn('No active RabbitMQ connection to disconnect', 'warn');
  }
};
