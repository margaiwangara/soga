import { ConfirmChannel } from 'amqplib';

export type PublishToChannelProps = {
  routingKey: string;
  exchangeName: string;
  data: any;
};

export function publishToChannel(
  channel: ConfirmChannel,
  { routingKey, exchangeName, data }: PublishToChannelProps,
): Promise<void> {
  return new Promise((resolve, reject) => {
    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(data), 'utf-8'),
      { persistent: true },
      function (error, _) {
        if (error) {
          reject(error);
        }

        resolve();
      },
    );
  });
}
