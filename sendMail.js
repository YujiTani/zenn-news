import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = (subject, text) => {
  const message = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject,
    text,
  };

  const smtpConfig = {
    // 固定ホスト
    host: 'smtp.gmail.com',
    // 固定ポート
    port: 465,
    // 暗号化
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_FROM,
      // googleアカウントのアプリパスワードを設定
      // see https://support.google.com/accounts/answer/185833?hl=ja
      pass: process.env.APP_PASS
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  transporter.sendMail(message, function (err, response) {
    console.log(err || response);
  });
};

export { sendEmail };