const getArticles = async (page, maxPages = 10) => {
  const articles = [];
  
  try {
    for (let i = 1; i <= maxPages; i++) {
      try {
        // カード要素をすべて取得
        const articleCards = await page.locator('div[class*="ArticleList_itemContainer"]').all();
        
        // 各カードから必要な情報を取得
        for (const card of articleCards) {
          try {
            const titleLocator = await card.locator('h2');
            const title = await titleLocator.textContent();
            const likes = await card.locator('span[class*="ArticleList_like"]').textContent();
            const link = await card.locator('a[class*="ArticleList_link"]').getAttribute('href');
            
            // 記事詳細ページを確認して、タグを取得
            await titleLocator.click();
            await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
              console.log(`⚠️ ページ${i}の記事「${title}」でタイムアウトが発生しました`);
            });

            const topicLinks = await page.locator('a[class*="View_topicLink"]').all();
            const topicNames = [];

            if (topicLinks.length > 0) {
              for (const link of topicLinks) {
                const topicName = await link.locator('div[class*="View_topicName"]').textContent();
                topicNames.push(topicName.trim());
              }
            }

            articles.push({
              title: title.trim(),
              likes: parseInt(likes.replace(/[^0-9]/g, '')),
              url: `https://zenn.dev${link}`,
              tags: topicNames
            });

            // ブラウザバック
            await page.goBack();
            await page.waitForLoadState('domcontentloaded').catch(() => {
              console.log(`⚠️ ブラウザバック時にタイムアウトが発生しました`);
            });
          } catch (cardError) {
            console.log(`⚠️ 記事の処理中にエラーが発生しました:`, cardError.message);
            continue; // 次の記事へ進む
          }
        }

        // 次のページへ（最後のページ以外）
        if (i < maxPages) {
          const nextButton = page.locator('a', { hasText: '次のページへ' });
          
          if (!await nextButton.isVisible()) {
            console.log('✓ 最後のページに到達しました');
            break;
          }

          await nextButton.click();
          await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
            console.log(`⚠️ ページ${i + 1}への遷移時にタイムアウトが発生しました`);
          });
        }
      } catch (pageError) {
        console.log(`⚠️ ページ${i}の処理中にエラーが発生しました:`, pageError.message);
        break; // ページ処理を終了
      }
    }
  } catch (error) {
    console.log('⚠️ 重大なエラーが発生しました:', error.message);
  } finally {
    // 取得できた記事数を表示
    console.log(`✓ 合計${articles.length}件の記事を取得しました`);
    return articles; // エラーが発生しても、取得できた記事は返す
  }
};

export { getArticles };
