import ToggleSwitchProps from './ToggleSwitchProps'
import { Icon } from '@/app/common/constants/icons'

export default interface IconToggleSwitchProps extends ToggleSwitchProps {
  icons: [Icon, Icon]
}
