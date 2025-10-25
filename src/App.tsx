// src/App.tsx

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { addArticle, fetchSummary, setAllArticles, setAppStatus } from './store/articleSlice';
import { ArticleList } from './ArticleList';
import './index.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { appStatus, articles } = useSelector((state: RootState) => state.articles);

  // --- LOCAL STATE ---
  // State for the current browser tab info
  const [currentTab, setCurrentTab] = useState<{ id: string; url: string; title: string } | null>(null);
  // NEW: State for the search input field
  const [searchTerm, setSearchTerm] = useState('');

  // --- useEffect: Runs ONCE when popup opens ---
  useEffect(() => {
    // Load saved articles from storage
    chrome.storage.local.get(['articles'], (result) => {
      if (result.articles) {
        dispatch(setAllArticles(result.articles));
      }
    });

    // Get current active tab info
    async function getCurrentTabInfo() {
      try { // Added try-catch for safety
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id && tab.url && tab.title) {
          setCurrentTab({ id: tab.url, url: tab.url, title: tab.title });
        }
      } catch (error) {
        console.error("Error getting current tab:", error);
        // Handle error appropriately, maybe set an error state
      }
    }
    getCurrentTabInfo();
  }, [dispatch]);

  // --- Event Handlers ---
  const handleSave = () => {
    if (currentTab) {
      dispatch(setAppStatus('loading'));
      dispatch(addArticle(currentTab));
      dispatch(fetchSummary(currentTab));
    }
  };

  // --- Filtering Logic ---
  // Filter the articles based on the searchTerm
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if the current tab is already saved (using the full articles list)
  const isAlreadySaved = articles.some(article => article.id === currentTab?.id);

  // --- JSX ---
  return (
    <div className="app-container">
      <div className="header">
        <h3>AI Reading List</h3>
        <button
          className="save-button"
          onClick={handleSave}
          disabled={!currentTab || isAlreadySaved || appStatus === 'loading'}
        >
          {isAlreadySaved ? 'Page Already Saved' : (appStatus === 'loading' ? 'Saving...' : 'Save Current Page')}
        </button>
        {/* NEW: Search Input */}
        <input
          type="text"
          placeholder="Search saved articles..."
          className="search-input" // We'll add styles for this
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
        />
      </div>

      {/* Pass the FILTERED list down as a prop */}
      <ArticleList articles={filteredArticles} />
    </div>
  );
}

export default App;