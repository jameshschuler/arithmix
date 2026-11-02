import { NicknameForm } from '@/components/settings/NicknameForm'
import { ThemePicker } from '@/components/settings/ThemePicker'
import { PageHeader } from '@/components/shared/PageHeader'

export function SettingsRoute() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" />
      <NicknameForm />
      <ThemePicker />
    </div>
  )
}
