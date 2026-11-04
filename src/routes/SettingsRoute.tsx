import { InstallSection } from '@/components/settings/InstallSection'
import { SoundSettings } from '@/components/settings/SoundSettings'
import { NicknameForm } from '@/components/settings/NicknameForm'
import { ThemePicker } from '@/components/settings/ThemePicker'
import { PageHeader } from '@/components/shared/PageHeader'

export function SettingsRoute() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" />
      <NicknameForm />
      <ThemePicker />
      <SoundSettings />
      <InstallSection />
    </div>
  )
}
