import IconToggleSwitchProps from './interfaces/IconToggleSwitchProps'

import { ToggleSwitchContainer } from './styles'

export function IconToggleSwitch({
  toggled,
  onToggle,
  icons,
}: IconToggleSwitchProps) {
  function handleToggle() {
    onToggle()
  }

  const ToggledIcon = icons[0]
  const UntoggledIcon = icons[1]

  return (
    <ToggleSwitchContainer $toggled={toggled}>
      <button type="button" onClick={() => handleToggle()}>
        {toggled && <ToggledIcon size={16} weight="fill" />}
        {!toggled && <UntoggledIcon size={16} weight="fill" />}
      </button>
    </ToggleSwitchContainer>
  )
}
