import { ThemeToggleSwitch } from '../ToggleSwitch'

import { FooterContainer } from './styles'
import { useThemeSwitch } from '../../contexts'

export function Footer() {
  const { isDefaultTheme, changeTheme } = useThemeSwitch()

  return (
    <FooterContainer>
      <span>Em desenvolvimento por Bernardo Costa Nascimento.</span>

      <ThemeToggleSwitch toggled={isDefaultTheme} onToggle={changeTheme} />
    </FooterContainer>
  )
}
