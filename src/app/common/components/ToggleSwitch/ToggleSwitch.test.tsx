import '@testing-library/jest-dom'
import { render, screen, getByRole } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ToggleSwitch } from './ToggleSwitch'
import { IconToggleSwitch } from './IconToggleSwitch'
import { useState } from 'react'

interface TestPageProps {
  spy: () => void
}

const TestPage: React.FC<TestPageProps> = ({ spy }) => {
  const [toggled, setToggled] = useState(false)
  const handleToggle = () => {
    setToggled(true)
    spy()
  }

  return (
    <IconToggleSwitch
      toggled={toggled}
      onToggle={handleToggle}
      icons={['sun', 'moon']}
      data-testid="test-toggle-switch"
    />
  )
}

describe('ToggleSwitches', () => {
  describe('ToggleSwitch', () => {
    test('ToggleSwitch is in the document on render', () => {
      render(
        <ToggleSwitch
          toggled={true}
          onToggle={() => {}}
          data-testid="test-toggle-switch"
        />,
      )

      const toggleSwitch = screen.getByTestId('test-toggle-switch')

      expect(toggleSwitch).toBeInTheDocument()
    })

    test('ToggleSwitch on click toggles', async () => {
      let toggled = false
      const handleToggle = jest.fn().mockImplementation(() => {
        toggled = !toggled
      })

      render(
        <ToggleSwitch
          toggled={toggled}
          onToggle={handleToggle}
          data-testid="test-toggle-switch"
        />,
      )

      const toggleSwitch = screen.getByTestId('test-toggle-switch')
      const button = getByRole(toggleSwitch, 'button')

      await userEvent.click(button)

      expect(handleToggle).toHaveBeenCalled()
    })
  })

  describe('IconToggleSwitch', () => {
    test('IconToggleSwitch is in the document on render', () => {
      render(<TestPage spy={jest.fn()} />)

      const iconToggleSwitch = screen.getByTestId('test-toggle-switch')
      const untoggledIcon = screen.getByTestId('untoggled-icon')

      expect(iconToggleSwitch).toBeInTheDocument()
      expect(untoggledIcon).toBeInTheDocument()
    })

    test('IconToggleSwitch on click toggles and changes icons', async () => {
      const handleToggle = jest.fn()

      render(<TestPage spy={handleToggle} />)

      const iconToggleSwitch = screen.getByTestId('test-toggle-switch')
      const button = getByRole(iconToggleSwitch, 'button')

      await userEvent.click(button)

      const toggledIcon = screen.queryByTestId('toggled-icon')
      const untoggledIcon = screen.queryByTestId('untoggled-icon')

      expect(toggledIcon).toBeInTheDocument()
      expect(untoggledIcon).not.toBeInTheDocument()
      expect(handleToggle).toHaveBeenCalled()
    })
  })
})
