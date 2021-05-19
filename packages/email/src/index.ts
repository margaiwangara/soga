import nodemailer from 'nodemailer';
import env from './env';
import amqp, {
  Channel,
  ConfirmChannel,
  Connection,
  ConsumeMessage,
} from 'amqplib';
import http, { IncomingMessage, ServerResponse } from 'http';

export async function sendEmail(to: string, content: string, subject: string) {
  // const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: env.FROM_NOREPLY,
    to,
    subject,
    html: content,
  });

  console.log('email message sent', info.messageId);

  console.log('preview email url', nodemailer.getTestMessageUrl(info));
}

const connectionString =
  'amqps://oczncmcb:Yf99gpPMcaLfrEhKsRDNnpHagyC1SE_E@cow.rmq2.cloudamqp.com/oczncmcb';

async function listenForMessages(): Promise<void> {
  const connection = await amqp.connect(connectionString);
  const channel = await connection.createChannel();
  await channel.prefetch(1);

  // create second channel to send back results
  const resultsChannel = await connection.createConfirmChannel();

  await consume({ connection, channel, resultsChannel }).catch((error) =>
    console.log('Consume from RabbitMQ error', error),
  );
}

type ConsumeProps = {
  connection: Connection;
  channel: Channel;
  resultsChannel: ConfirmChannel;
};

function consume({ connection, channel }: ConsumeProps): Promise<void> {
  return new Promise((resolve, reject) => {
    channel.consume(
      'processing.requests',
      async function (msg: ConsumeMessage | null) {
        if (msg !== null) {
          const msgBody = JSON.parse(msg?.content.toString() || '');
          const user = msgBody ? { ...msgBody } : null;

          // console.log('response', { user, msgBody });
          console.log('message', msg);

          // process data
          // const processingResults =
          // await processMessage(msgBody.requestData);
          await sendEmail(
            user.userEmail,
            'Welcome to Soga. We are glad to have you.',
            'Welcome to Soga',
          );

          // acknowledge message has been processed
          await channel.ack(msg);
        } else {
          console.log('No messages to consume');
        }

        resolve();
      },
    );

    // close connection
    connection.on('close', (error) => {
      return reject(error);
    });

    // handle errors
    connection.on('error', (error) => {
      return reject(error);
    });
  });
}

// simulate data processing that takes 5 seconds
// function processMessage(requestData: unknown) {
//   return new Promise((resolve, _) => {
//     setTimeout(() => {
//       resolve(`${requestData}-processed`);
//     }, 5000);
//   });
// }

// listen for results
listenForMessages();
// console.log('Hello there');

// init server
const PORT = env.PORT || 3000;
const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200);
  res.end('Node Server Created');
});

server.listen(PORT, 'localhost', () =>
  console.log(`Server running on port ${PORT}`),
);
