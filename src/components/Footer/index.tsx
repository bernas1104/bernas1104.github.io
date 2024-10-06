import { Moon, Sun } from 'phosphor-react'

import { FooterContainer } from './styles'
import { useThemeSwitch } from '../../contexts'
import { IconToggleSwitch } from '../ToggleSwitch'

export function Footer() {
  const { isDefaultTheme, changeTheme } = useThemeSwitch()

  return (
    <FooterContainer>
      <span>Em desenvolvimento por Bernardo Costa Nascimento.</span>

      <IconToggleSwitch
        toggled={isDefaultTheme}
        onToggle={changeTheme}
        icons={[Moon, Sun]}
      />
    </FooterContainer>
  )
}
