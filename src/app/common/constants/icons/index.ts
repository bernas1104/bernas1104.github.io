import { Icon as IconType, Moon, Sun } from '@phosphor-icons/react'

export type Icon = 'sun' | 'moon'

type Icons = {
  [K in Icon]: IconType
}

const Icons: Icons = {
  sun: Sun,
  moon: Moon,
}

export default Icons
