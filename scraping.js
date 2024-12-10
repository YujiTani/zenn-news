// クロニウムを使って、Zennにアクセスする
import { chromium } from "@playwright/test";

import { scrapeArticlesWithHighLikes } from "./scrapeArticlesWithHighLikes.js";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300,
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto("https://zenn.dev");

  const searchInput = page.locator("#header-search");
  await searchInput.click();

  // 部分的なクラス名とhrefの組み合わせ
  // TODO: 配列で複数実行できるようにしたい
  const topicLink = page.locator(
    'a[class*="TopicCardList_link"][href="/topics/nodejs"]'
  );
  await topicLink.click();

  const allTimeSortButton = page.locator('a[class*="TabLinkGroup_link"]', {
    hasText: 'Alltime'
  });
  await allTimeSortButton.click();

  const articles = await scrapeArticlesWithHighLikes(page);
  console.log(articles);

  // await browser.close();
})();
