import { OptionGroup } from '@/components/shared/OptionGroup'
import { useThemeContext } from '@/contexts/theme-context'
import { THEMES } from '@/lib/theme'

export function ThemePicker() {
  const { theme, setTheme } = useThemeContext()

  return <OptionGroup label="Appearance" options={THEMES} value={theme} onChange={setTheme} />
}
