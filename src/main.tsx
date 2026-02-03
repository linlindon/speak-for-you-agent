import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initMockData } from '@/lib/mockData'


if (!localStorage.getItem('chat-sessions')) {
  initMockData()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)