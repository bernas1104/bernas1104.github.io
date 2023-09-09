import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { ThemeSwitchContextProvider } from './contexts/ThemeSwitchContext.tsx'

import './global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeSwitchContextProvider>
      <App />
    </ThemeSwitchContextProvider>
  </React.StrictMode>,
)
