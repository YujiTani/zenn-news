import cron from 'node-cron';

// 毎週月曜日0時にスクレイピングを実行する
cron.schedule('0 0 * * 1', () => {
  scraping();
});
