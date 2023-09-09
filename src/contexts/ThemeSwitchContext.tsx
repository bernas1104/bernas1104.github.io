import { ReactNode, createContext, useEffect, useState } from 'react'
import { DefaultTheme } from 'styled-components/dist/types'

import { defaultTheme } from '../styles/themes/default'
import { lightTheme } from '../styles/themes/light'

enum Theme {
  Default = 'Default',
  Light = 'Light',
}

interface ThemeSwitchContext {
  theme: DefaultTheme
  isDefaultTheme: boolean
  changeTheme: () => void
}

export const ThemeSwitchContext = createContext({} as ThemeSwitchContext)

interface ThemeSwitchContextProviderProps {
  children: ReactNode
}

export function ThemeSwitchContextProvider({
  children,
}: ThemeSwitchContextProviderProps) {
  const [currentTheme, setCurrentTheme] = useState(Theme.Default)

  function changeTheme() {
    setCurrentTheme((state) => {
      if (state === Theme.Default) {
        localStorage.setItem('ApplicationTheme', Theme.Light)
        return Theme.Light
      }

      localStorage.setItem('ApplicationTheme', Theme.Default)
      return Theme.Default
    })
  }

  const isDefaultTheme = currentTheme === Theme.Default
  const theme = isDefaultTheme ? defaultTheme : lightTheme

  useEffect(() => {
    const applicationTheme = localStorage.getItem('ApplicationTheme')
    if (applicationTheme === null) {
      localStorage.setItem('ApplicationTheme', Theme.Default)
      setCurrentTheme(Theme.Default)
      return
    }

    if (applicationTheme === Theme.Light) {
      setCurrentTheme(Theme.Light)
    }
  }, [])

  return (
    <ThemeSwitchContext.Provider value={{ theme, isDefaultTheme, changeTheme }}>
      {children}
    </ThemeSwitchContext.Provider>
  )
}
