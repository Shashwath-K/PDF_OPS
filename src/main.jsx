import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // <-- This loads Tailwind and the font

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)