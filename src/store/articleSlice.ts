// src/store/articleSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// --- 1. DEFINE THE "TYPES" (The Vault's Blueprint) ---
// Why? This is our TypeScript blueprint. It tells our app the
// exact "shape" of our data. This gives us auto-complete and
// prevents bugs, like typos.

export interface Article {
  id: string; // The URL of the article will be its unique ID
  url: string;
  title: string;
  summary: string | null; // Null when we haven't fetched it yet
  // This "status" is for *each individual article*
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export interface ArticlesState {
  articles: Article[];
  // This "status" is for the *main "Save" button*
  appStatus: 'idle' | 'loading';
}

// --- 2. DEFINE THE "INITIAL STATE" (The Vault's Default) ---
// Why? When a user opens the app for the very first time,
// this is what the vault will look like.
const initialState: ArticlesState = {
  articles: [],
  appStatus: 'idle',
}

// --- 3. DEFINE THE "ASYNC MISSION" (The Hardcore Part) ---
// Why? This is our "mission" for fetching a summary. We can't
// run this in the "teller's" main logic because it's SLOW.
// createAsyncThunk handles all the messy "loading" and "error"
// states for us.
export const fetchSummary = createAsyncThunk(
  'articles/fetchSummary', // This is the "name" of the mission
  async (article: { id: string; url: string; title: string }, thunkAPI) => {
    
    // This is the code our "mission control" will run.
    // We send the article URL to our Python backend (which we'll build)
    const response = await fetch("https://your-gcp-function-url-goes-here/summarize", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: article.url }),
    })
    
    // If the server fails (e.g., 404, 500 error)
    if (!response.ok) {
      // This will trigger our "rejected" case below
      return thunkAPI.rejectWithValue('Failed to get summary.')
    }
    
    const data = await response.json();

    // This data (`{ id, summary }`) will be the "payload"
    // of our "fulfilled" action below.
    return { id: article.id, summary: data.summary }
  }
)

// --- 4. CREATE THE "TELLER" (The Slice) ---
// Why? createSlice is the "factory" that builds our teller.
// It takes all our rules and auto-generates the "teller" (reducer)
// and the "forms" (actions) for us.
export const articleSlice = createSlice({
  name: 'articles', // The internal name for this "department"
  initialState,     // The default state for the vault
  
  // --- 5. DEFINE THE "SYNCHRONOUS FORMS" (Reducers) ---
  // Why? These are the *fast, direct* jobs the teller can do.
  reducers: {
    // This "form" is for adding a new article
    addArticle: (state, action: PayloadAction<{ id: string; url: string; title: string }>) => {
      // This code is "safe" because Redux Toolkit lets us
      // "mutate" the state directly here.
      state.articles.push({
        ...action.payload, // The data from our "form"
        summary: null,
        status: 'idle', // It's idle, ready for the "fetchSummary" mission
      })
      // We also reset the main app status, just in case
      state.appStatus = 'idle';
    },
    // This "form" is for removing an article
    removeArticle: (state, action: PayloadAction<string>) => {
      // The "payload" (data) is just the ID string
      const idToRemove = action.payload;
      state.articles = state.articles.filter(article => article.id !== idToRemove)
    },
    // This "form" is for loading our saved list from the "hard drive"
    setAllArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    // This "form" is for the main "Save" button's loading state
    setAppStatus: (state, action: PayloadAction<'idle' | 'loading'>) => {
      state.appStatus = action.payload;
    }
  },
  
  // --- 6. DEFINE "MISSION CONTROL" (extraReducers) ---
  // Why? This tells the "teller" how to react when the
  // "fetchSummary" mission (our thunk) gives a status update.
  extraReducers: (builder) => {
    builder
      // "The mission has started..."
      .addCase(fetchSummary.pending, (state, action) => {
        // 'action.meta.arg' is the {article} we passed in
        const article = state.articles.find(a => a.id === action.meta.arg.id)
        if (article) {
          article.status = 'loading' // Show a spinner for this *one* item
        }
      })
      // "The mission succeeded!"
      .addCase(fetchSummary.fulfilled, (state, action) => {
        // 'action.payload' is the `{ id, summary }` we returned
        const article = state.articles.find(a => a.id === action.payload.id)
        if (article) {
          article.status = 'succeeded'
          article.summary = action.payload.summary // Add the summary!
        }
      })
      // "The mission failed..."
      .addCase(fetchSummary.rejected, (state, action) => {
        // 'action.meta.arg' is the {article} we passed in
        const article = state.articles.find(a => a.id === action.meta.arg.id)
        if (article) {
          article.status = 'failed' // Show an error for this item
        }
      })
  },
})

// --- 7. EXPORT THE "FORMS" AND THE "TELLER" ---
// Why? We need to export these so other files can use them.
// Our React components will import the "forms" (actions).
// Our "bank" (store.ts) has already imported the "teller" (reducer).

export const { addArticle, removeArticle, setAllArticles, setAppStatus } = articleSlice.actions

export default articleSlice.reducer // This is the "teller"