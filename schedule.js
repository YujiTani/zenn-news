import cron from 'node-cron';

import { main } from './scraping.js';
import { sendEmail } from './sendMail.js';

// 毎週月曜日0時にスクレイピングを実行する
cron.schedule('0 0 * * 1', () => {
  main();
  sendEmail('Zenn記事の更新通知', '最新のZenn記事が更新されました。詳細は以下のリンクをご確認ください。');
});
