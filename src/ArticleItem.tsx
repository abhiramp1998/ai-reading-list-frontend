// src/ArticleItem.tsx

// --- 1. Imports ---
// We need the hook to send "forms" (actions) to the Redux teller
import { useDispatch } from 'react-redux';
// We need the type definition for our Redux dispatch function
import { AppDispatch } from './store/store';
// We need the "type" for an article and the "removeArticle" form (action)
import { Article, removeArticle } from './store/articleSlice';

// --- 2. Define Component Props ---
// Why? This tells TypeScript what kind of "input" this component expects.
// It expects one prop named `article`, which must match the `Article` interface.
interface ArticleItemProps {
  article: Article;
}

// --- 3. The Component ---
// We receive the `article` object via props (destructured)
export function ArticleItem({ article }: ArticleItemProps) {
  // --- 4. Connect to Redux ---
  // Get the `dispatch` function so we can send the "removeArticle" form
  const dispatch = useDispatch<AppDispatch>();

  // --- 5. Event Handler for Delete Button ---
  const handleDelete = () => {
    // Dispatch the 'removeArticle' form.
    // The payload (the data on the form) is the article's ID.
    dispatch(removeArticle(article.id));
  };

  // --- 6. The JSX (The UI for one item) ---
  return (
    <li className="article-item">
      {/* Display the article title */}
      <h4>{article.title}</h4>
      {/* Display the URL as a clickable link */}
      <a className="article-item-url" href={article.url} target="_blank" rel="noopener noreferrer">
        {article.url}
      </a>

      {/*
        Conditional Rendering based on the article's status:
        This is where we react to the 'pending', 'fulfilled', or 'rejected'
        states managed by our async thunk and extraReducers.
      */}
      {article.status === 'loading' && <p className="article-status">Generating summary...</p>}
      {article.status === 'failed' && <p className="article-status">Error: Could not get summary.</p>}
      {/* Only show the summary paragraph if the status is 'succeeded' AND a summary exists */}
      {article.status === 'succeeded' && article.summary && <p className="article-summary">{article.summary}</p>}

      {/* Actions section with the delete button */}
      <div className="article-actions">
        <button className="delete-button" onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
}