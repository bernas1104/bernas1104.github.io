import { useState } from 'react'
import { Sun, Moon } from 'phosphor-react'

import { ToggleSwitchContainer } from './styles'

export function ToggleSwitch() {
  const [toggled, setToggled] = useState(false)

  return (
    <ToggleSwitchContainer $toggled={toggled}>
      <span onClick={() => setToggled((state) => !state)}>
        {toggled && <Moon size={16} weight="fill" />}
        {!toggled && <Sun size={16} weight="fill" />}
      </span>
    </ToggleSwitchContainer>
  )
}
