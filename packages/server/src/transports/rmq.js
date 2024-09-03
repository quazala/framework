import amqp from 'amqplib';
import { Transport } from './abstract';

export class RabbitMQTransport extends Transport {
  constructor(server, config) {
    super(server, null);
    this.config = config;
    this.connection = null;
    this.channel = null;
    this.queue = config.queue || 'default_queue';
    this.exchange = config.exchange || 'default_exchange';
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.config.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(this.queue);
      await this.channel.assertExchange(this.exchange, 'topic');
      await this.channel.bindQueue(this.queue, this.exchange, '#');

      this.channel.consume(this.queue, (msg) => {
        if (msg !== null) {
          this.handleMessage(msg);
          this.channel.ack(msg);
        }
      });

      this.logger('Connected to RabbitMQ');
    } catch (error) {
      this.logger('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async handleMessage(msg) {
    const content = msg.content.toString();
    try {
      const data = JSON.parse(content);
      await this.server.process(this, data);
    } catch (error) {
      this.logger('Error processing message:', error);
    }
  }

  async send(data) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    const message = Buffer.from(JSON.stringify(data));
    this.channel.publish(this.exchange, this.queue, message);
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.logger('Closed RabbitMQ connection');
  }
}
