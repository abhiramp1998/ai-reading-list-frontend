import { configureStore } from '@reduxjs/toolkit'
 // teller with access to the vault which is the configure store 
import articleReducer from './articleSlice'


export const store = configureStore({
  // The 'reducer' object is the "list of departments"
  reducer: {
    // We're creating one department (a "slice") called "articles"
    // and assigning our "teller" (articleReducer) to it.
    articles: articleReducer,
  },
})

// 3. These "types" are for TypeScript. They are like a
//    "Bank Directory" and "Form Template".
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 4. This is the "Security Camera" for persistence.
store.subscribe(() => {
  chrome.storage.local.set({
    articles: store.getState().articles.articles,
  })
})