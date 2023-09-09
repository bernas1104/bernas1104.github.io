import { ThemeProvider } from 'styled-components'

import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { useThemeSwitch } from './contexts'

function App() {
  const { theme } = useThemeSwitch()

  return (
    <ThemeProvider theme={theme}>
      <Home />

      <Footer />
    </ThemeProvider>
  )
}

export default App
