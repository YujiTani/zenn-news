import { chromium } from "@playwright/test";

import { getArticles } from "./getArticles.js";
import { updateArticleSheet } from "./updateArticleSheet.js";
import { updateArticleTagsSheet } from "./updateArticleTagsSheet.js";

const main = async () => {
  const browser = await chromium.launch(
    // デバック時にコメントを外す
    {
    headless: false,
    slowMo: 300,
    }
  );

  // 変更可能な値
  const maxPages = 1;
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto("https://zenn.dev");

  const searchInput = page.locator("#header-search");
  await searchInput.click();
  // 新しいネットワークリクエストが発生しない状態になるまで待つ
  await page.waitForLoadState('networkidle');

  // 部分的なクラス名とhrefの組み合わせ
  // TODO: 配列で複数実行できるようにしたい
  const topicLink = page.locator(
    'a[class*="TopicCardList_link"][href="/topics/nodejs"]'
  );
  await topicLink.click();
  await page.waitForLoadState('networkidle');

  const allTimeSortButton = page.locator('a[class*="TabLinkGroup_link"]', {
    hasText: 'Alltime'
  });
  await allTimeSortButton.click();
  await page.waitForLoadState('networkidle');

  const articles = await getArticles(page, maxPages);
  await updateArticleSheet(articles);
  // 制限に引っかからないように1分待機する
  console.log('制限にかからないように1分待機後、次の処理を実行します');
  await new Promise(resolve => setTimeout(resolve, 60000));
  await updateArticleTagsSheet(articles);

  await browser.close();
};

// schedule.jsで実行する場合は、main()をコメントアウトする
main();

export { main };
