// src/App.tsx

// --- 1. Imports ---
// We need React's built-in hooks
import { useEffect, useState } from 'react';
// We need the hooks to talk to Redux
import { useSelector, useDispatch } from 'react-redux';
// We need our Redux store's "types" for TypeScript
import type { RootState, AppDispatch } from './store/store';
// We need the "forms" (actions) and "types" from our slice
import { addArticle, fetchSummary, setAllArticles, setAppStatus } from './store/articleSlice';
// We need the component that will display the list
import { ArticleList } from './ArticleList'; 
// Import our CSS
import './index.css';

function App() {
  // --- 2. Connect to Redux ---
  // `dispatch` is our function to send "forms" to the Redux teller
  const dispatch = useDispatch<AppDispatch>();
  // `useSelector` lets us read data directly from the Redux vault
  // We grab the overall app status and the list of articles
  const { appStatus, articles } = useSelector((state: RootState) => state.articles);

  // --- 3. React Local State ---
  // `useState` is for data *only this component* needs.
  // We'll store the info about the *current* browser tab here.
  const [currentTab, setCurrentTab] = useState<{ id: string; url: string; title: string } | null>(null);

  // --- 4. useEffect: Code to run ONCE when the popup opens ---
  // Why? We need to do two setup tasks: load saved data & get current tab.
  useEffect(() => {
    // Task A: Load saved articles from Chrome's "hard drive"
    chrome.storage.local.get(['articles'], (result) => {
      // Check if there was anything saved
      if (result.articles) {
        // If yes, dispatch the 'setAllArticles' form to load it into Redux
        dispatch(setAllArticles(result.articles));
      }
    });

    // Task B: Get info about the currently active browser tab
    async function getCurrentTabInfo() {
      // Use the Chrome API to query for the active tab in the current window
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      // Make sure the tab has all the info we need
      if (tab && tab.id && tab.url && tab.title) {
        // Save this info to our *local* state using the setter function
        // We use the URL as the unique ID for our articles
        setCurrentTab({ id: tab.url, url: tab.url, title: tab.title });
      }
    }
    getCurrentTabInfo();
    // The empty array [] means this useEffect runs only ONCE after the component mounts
  }, [dispatch]); // Include dispatch in dependency array as per best practices

  // --- 5. Event Handler for the "Save" button ---
  const handleSave = () => {
    // Only proceed if we have valid current tab info
    if (currentTab) {
      // Dispatch 'setAppStatus' form to show a loading state on the button
      dispatch(setAppStatus('loading'));

      // Dispatch the 'addArticle' form. The teller (reducer) will
      // immediately add this article to the vault (state).
      dispatch(addArticle(currentTab));

      // Dispatch the 'fetchSummary' form. The "specialist" (thunk)
      // will start its async mission to get the AI summary.
      dispatch(fetchSummary(currentTab));
    }
  };

  // --- 6. Render Logic ---
  // Check if the current tab's URL (our ID) is already in the Redux articles list
  const isAlreadySaved = articles.some(article => article.id === currentTab?.id);

  // --- 7. The JSX (The UI Structure) ---
  return (
    <div className="app-container">
      {/* Header section with title and button */}
      <div className="header">
        <h3>AI Reading List</h3>
        <button
          className="save-button"
          onClick={handleSave}
          // Disable the button if:
          // - We don't have the current tab info yet OR
          // - The article is already saved OR
          // - The app is currently in a loading state (already saving)
          disabled={!currentTab || isAlreadySaved || appStatus === 'loading'}
        >
          {/* Change button text based on the state */}
          {isAlreadySaved ? 'Page Already Saved' : (appStatus === 'loading' ? 'Saving...' : 'Save Current Page')}
        </button>
      </div>

      {/* Render the list component (which we'll create next) */}
      <ArticleList />
    </div>
  );
}

export default App;