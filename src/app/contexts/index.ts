import { useContext } from 'react'

import { ThemeSwitchContext } from './ThemeSwitchContext'

export const useThemeSwitch = () => useContext(ThemeSwitchContext)
