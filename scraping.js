import { chromium } from "@playwright/test";

import { getArticles } from "./getArticles.js";
import { updateGoogleSpreadSheet } from "./updateGoogleSpreadSheet.js";

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

  const maxPages = 10;
  const articles = await getArticles(page, maxPages);
  await updateGoogleSpreadSheet(articles);

  await browser.close();
})();
