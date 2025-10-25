import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux' // 1. Import the "Connector"
import { store } from './store/store'     // 2. Import our "Bank"
import App from './App'
import './index.css' // We'll create this file next

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)