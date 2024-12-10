const getArticles = async (page, maxPages = 10) => {
  const articles = [];
  
  for (let i = 1; i <= maxPages; i++) {
  // カード要素をすべて取得
  const articleCards = await page.locator('div[class*="ArticleList_itemContainer"]').all();
  
  // 各カードから必要な情報を取得
  for (const card of articleCards) {
    const title = await card.locator('h2').textContent();
    const likes = await card.locator('span[class*="ArticleList_like"]').textContent();
    const link = await card.locator('a[class*="ArticleList_link"]').getAttribute('href');
    
    // 記事詳細ページを確認して、タグも取ってきてほしい
    // タグを取得後ブラウザバックする


    articles.push({
      title: title.trim(),
      likes: parseInt(likes.replace(/[^0-9]/g, '')),
      url: `https://zenn.dev${link}`
    });
    }

    // 次のページへ（最後のページ以外）
    if (i < maxPages) {
      const nextButton = page.locator('a', { hasText: '次のページへ' });

      if (!nextButton.isVisible()) {
        break;
      }

      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }
  }

  return articles;
}

export { getArticles };
