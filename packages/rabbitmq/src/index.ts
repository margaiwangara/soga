import amqp from 'amqplib';
import { env as envBase } from '@soga/shared';

async function setup(): Promise<void> {
  console.log('Setting up RabbitMQ Exchanges/Queues');

  // connect
  const connection = await amqp.connect(
    envBase.MESSAGE_QUEUE_CONNECTION_STRING,
  );

  // create channel
  const channel = await connection.createChannel();

  // create exchange
  await channel.assertExchange('processing', 'direct', { durable: true });

  // create queues
  await channel.assertQueue(
    `processing.requests.${envBase.MAILING_QUEUE_NAME}`,
    { durable: true },
  );
  await channel.assertQueue(
    `processing.results.${envBase.MAILING_QUEUE_NAME}`,
    { durable: true },
  );

  // bind queues
  await channel.bindQueue(
    `processing.requests.${envBase.MAILING_QUEUE_NAME}`,
    'processing',
    'request',
  );
  await channel.bindQueue(
    `processing.results.${envBase.MAILING_QUEUE_NAME}`,
    'processing',
    'result',
  );

  console.log('RabbitMQ Setup DONE');
  // return true;
  // process.exit();
}

setup().catch((error) => console.log('RabbitMQ Connection Error', error));
