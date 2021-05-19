import amqp from 'amqplib';
import env from './env';

// connection string
// const messageQueueConnectionString = env.MESSAGE_QUEUE_CONNECTION_STRING;

async function setup(): Promise<void> {
  console.log('Setting up RabbitMQ Exchanges/Queues');

  // connect
  const connection = await amqp.connect(env.MESSAGE_QUEUE_CONNECTION_STRING);

  // create channel
  const channel = await connection.createChannel();

  // create exchange
  await channel.assertExchange('processing', 'direct', { durable: true });

  // create queues
  await channel.assertQueue('processing.requests', { durable: true });
  await channel.assertQueue('processing.results', { durable: true });

  // bind queues
  await channel.bindQueue('processing.requests', 'processing', 'request');
  await channel.bindQueue('processing.results', 'processing', 'result');

  console.log('Setup DONE');
  // return true;
  // process.exit();
}

setup().catch((error) => console.log('RabbitMQ Connection Error', error));
