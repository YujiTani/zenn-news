import cron from 'node-cron';

import { main } from './scraping.js';
import { sendEmail } from './sendMail.js';

// cronの書き方
// ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │
// │ │ │ │ └── 曜日 (0-7) (0または7は日曜日)
// │ │ │ └──── 月 (1-12)
// │ │ └────── 日 (1-31)
// │ └──────── 時 (0-23)
// └────────── 分 (0-59)

// 毎週月曜日0時にスクレイピングを実行する
cron.schedule('0 0 * * 1', async () => {
  await main();
  await sendEmail('Zenn記事の更新通知', '最新のZenn記事が更新されました。詳細は以下のリンクをご確認ください。');
});
