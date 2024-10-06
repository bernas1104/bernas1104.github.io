import ToggleSwitchProps from './interfaces/ToggleSwitchProps'

import { ToggleSwitchContainer } from './styles'

export function ToggleSwitch({
  toggled,
  onToggle,
  'data-testid': dataTestid,
}: ToggleSwitchProps) {
  return (
    <ToggleSwitchContainer $toggled={toggled} data-testid={dataTestid}>
      <button type="button" role="button" onClick={() => onToggle()} />
    </ToggleSwitchContainer>
  )
}
