// src/ArticleList.tsx

// REMOVED: import { useSelector } from 'react-redux';
// REMOVED: import { RootState } from './store/store';
import { ArticleItem } from './ArticleItem';
import { Article } from './store/articleSlice'; // Import the Article type

// --- NEW: Define Props ---
// This component now expects an 'articles' array to be passed in
interface ArticleListProps {
  articles: Article[];
}

// --- Component receives 'articles' via props ---
export function ArticleList({ articles }: ArticleListProps) {

  // REMOVED: const articles = useSelector(...);

  // Prepare data for display (using the prop)
  const reversedArticles = [...articles].reverse();

  return (
    <ul className="article-list">
      {/* Render message if the list is empty */}
      {reversedArticles.length === 0 && (
        <p className="empty-list-message">No saved articles found.</p>
      )}
      {/* Map over the PROPS */}
      {reversedArticles.map(article => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </ul>
  );
}