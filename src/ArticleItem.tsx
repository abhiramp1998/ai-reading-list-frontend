// src/ArticleItem.tsx

import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { Article, removeArticle } from './store/articleSlice';

// Define the expected input (props) for this component
interface ArticleItemProps {
  article: Article;
}

export function ArticleItem({ article }: ArticleItemProps) {
  // Get the dispatch function to send actions to Redux
  const dispatch = useDispatch<AppDispatch>();

  // Function to handle clicking the delete button
  const handleDelete = () => {
    dispatch(removeArticle(article.id)); // Dispatch the remove action with the article's ID
  };

  return (
    <li className="article-item">
      <h4>{article.title}</h4>
      <a className="article-item-url" href={article.url} target="_blank" rel="noopener noreferrer">
        {article.url}
      </a>

      {/* Conditionally render based on the article's summary fetch status */}
      {article.status === 'loading' && <p className="article-status">Generating summary...</p>}
      {article.status === 'failed' && <p className="article-status">Error: Could not get summary.</p>}

      {/* Render the summary as a list if it succeeded and exists */}
      {article.status === 'succeeded' && article.summary && (
        <ul className="article-summary-list"> {/* Use <ul> for semantic list */}
          {
            article.summary.split('\n') // Split summary string into lines
              .filter(line => line.trim() !== '') // Remove empty lines
              .map((line, index) => ( // Loop through each line
                <li key={index}> {/* Render each line as a list item */}
                  {line.replace(/^\s*\*\s*/, '')} {/* Remove leading "*" and spaces */}
                </li>
              ))
          }
        </ul>
      )}

      {/* Section for action buttons */}
      <div className="article-actions">
        <button className="delete-button" onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
}