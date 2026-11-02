import { Award, Settings, Trophy } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { to: '/leaderboard', label: 'Leaderboard', Icon: Trophy },
  { to: '/achievements', label: 'Achievements', Icon: Award },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export function HomeNav() {
  return (
    <nav className="flex justify-end gap-1">
      {NAV_LINKS.map(({ to, label, Icon }) => (
        <Button
          key={to}
          variant="ghost"
          size="icon-lg"
          aria-label={label}
          nativeButton={false}
          render={<Link to={to} />}
        >
          <Icon className="size-5" />
        </Button>
      ))}
    </nav>
  )
}
