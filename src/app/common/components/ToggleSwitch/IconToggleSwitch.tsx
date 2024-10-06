import Icons from '../../constants/icons'
import IconToggleSwitchProps from './interfaces/IconToggleSwitchProps'

import { ToggleSwitchContainer } from './styles'

export function IconToggleSwitch({
  toggled,
  onToggle,
  icons,
  'data-testid': dataTestId,
}: IconToggleSwitchProps) {
  const ToggledIcon = Icons[icons[0]]
  const UntoggledIcon = Icons[icons[1]]

  return (
    <ToggleSwitchContainer $toggled={toggled} data-testid={dataTestId}>
      <button type="button" role="button" onClick={() => onToggle()}>
        {toggled && (
          <ToggledIcon size={16} weight="fill" data-testid="toggled-icon" />
        )}
        {!toggled && (
          <UntoggledIcon size={16} weight="fill" data-testid="untoggled-icon" />
        )}
      </button>
    </ToggleSwitchContainer>
  )
}
