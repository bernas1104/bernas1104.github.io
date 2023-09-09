import { Moon, Sun } from 'phosphor-react'

import { ToggleSwitchContainer } from './styles'

interface ToggleSwitchProps {
  toggled: boolean
  onToggle: () => void
}

export function ToggleSwitch({ toggled, onToggle }: ToggleSwitchProps) {
  function handleToggle() {
    onToggle()
  }

  return (
    <ToggleSwitchContainer $toggled={toggled}>
      <button type="button" onClick={() => handleToggle()} />
    </ToggleSwitchContainer>
  )
}

export function ThemeToggleSwitch({ toggled, onToggle }: ToggleSwitchProps) {
  function handleToggle() {
    onToggle()
  }

  return (
    <ToggleSwitchContainer $toggled={toggled}>
      <button type="button" onClick={() => handleToggle()}>
        {toggled && <Moon size={16} weight="fill" />}
        {!toggled && <Sun size={16} weight="fill" />}
      </button>
    </ToggleSwitchContainer>
  )
}
