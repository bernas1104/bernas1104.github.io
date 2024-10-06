'use client'

import React from 'react'

import { ThemeSwitchContextProvider } from './contexts/ThemeSwitchContext'
import App from './App'

export default function Home() {
  return (
    <React.StrictMode>
      <ThemeSwitchContextProvider>
        <App />
      </ThemeSwitchContextProvider>
    </React.StrictMode>
  )
}
