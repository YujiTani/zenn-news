import { GoogleSpreadsheet } from 'google-spreadsheet';
import env from 'dotenv';
import { createRequire } from 'module';

env.config();

const require = createRequire(import.meta.url);

const updateGoogleSpreadSheet = async (data) => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  });

  await doc.loadInfo();

  // 初回実行時はシートを作成する必要があるため、コメントを外す
  // シートが存在する場合この工程はスキップする

  let sheet = doc.sheetsByTitle['zenn_articles'];

  if (!sheet) {
    sheet = await doc.addSheet({
      title: 'zenn_articles',
      headerValues: ['title', 'likes', 'url']
    });
  }

  const rows = await sheet.addRows(data);
  
  // 200件ずつ保存する、完了しない場合は1分待機して再度実行する
  // ソース: https://developers.google.com/sheets/api/limits?hl=ja 
  const batchSize = 200;
  
  for (let i = 0; i < rows.length; i += batchSize) {
    // 現在のバッチ（200行分）を切り出し
    const batch = rows.slice(i, i + batchSize);
    // バッチ内の各行を並列保存
    try {
      await Promise.all(batch.map(async row => {
        try {
          await row.save();
        } catch (error) {
          console.error(`Error saving row: ${row.title}`, error);
        }
      }));
    } catch (error) {
      console.error('バッチ処理全体が失敗', error);
    }

    if (rows.length > i + batchSize) {
      console.log('1分待機して再度実行します');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
};

export { updateGoogleSpreadSheet };
