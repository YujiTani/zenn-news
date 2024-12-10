const scrapeArticlesWithHighLikes = async (page, maxPages = 5) => {
  const articles = [];
  
  for (let i = 1; i <= maxPages; i++) {
    // いいね数が3桁以上の記事を検索
    const articleElements = page.locator(
      'article[class*="ArticleList_container"]'
    )
    const articleElement = await articleElements.first().textContent();
    articles.push(articleElement);
  }
    // .filter({
    //   has: page.locator('.ArticleList_like', {
    //     hasText: /[0-9]{3,}/  // 3桁以上の数字にマッチ
    //   })
    // });

  //   // 記事の情報を収集
  //   const count = await articleElements.count();
  //   for (let j = 0; j < count; j++) {
  //     const article = articleElements.nth(j);
  //     const title = await article.locator('h2').textContent();
  //     const link = await article.locator('a').first().getAttribute('href');
  //     const likes = await article.locator('.ArticleList_like').textContent();
      
  //     articles.push({
  //       title: title.trim(),
  //       link: `https://zenn.dev${link}`,
  //       likes: parseInt(likes.replace(/[^0-9]/g, ''))
  //     });
  //   }

  //   // 次のページへ（最後のページ以外）
  //   if (i < maxPages) {
  //     const nextButton = page.locator('button', { hasText: '次のページ' });
  //     if (await nextButton.isVisible()) {
  //       await nextButton.click();
  //       await page.waitForLoadState('networkidle');
  //     } else {
  //       break; // 次のページがない場合は終了
  //     }
  //   }
  // }

  return articles;
}

export { scrapeArticlesWithHighLikes };
