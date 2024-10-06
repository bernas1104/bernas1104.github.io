import ToggleSwitchProps from './interfaces/ToggleSwitchProps'

import { ToggleSwitchContainer } from './styles'

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
