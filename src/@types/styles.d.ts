import 'styled-components'

import { defaultTheme } from '../styles/themes/default'
import { lightTheme } from '../styles/themes/light'

type DefaultThemeType = typeof defaultTheme
type LightThemeType = typeof lightTheme

declare module 'styled-components' {
  export interface DefaultTheme extends DefaultThemeType, LightThemeType {}
}
