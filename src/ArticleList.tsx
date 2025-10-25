// src/ArticleList.tsx

import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { ArticleItem } from './ArticleItem'; // It imports ArticleItem

export function ArticleList() {
  const articles = useSelector((state: RootState) => state.articles.articles);
  const reversedArticles = [...articles].reverse();

  return (
    <ul className="article-list">
      {reversedArticles.map(article => (
        <ArticleItem key={article.id} article={article} /> // It renders ArticleItem
      ))}
    </ul>
  );
}