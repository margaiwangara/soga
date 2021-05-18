import nodemailer from 'nodemailer';
import env from '../env';

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
