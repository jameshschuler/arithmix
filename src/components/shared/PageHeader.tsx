import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

type PageHeaderProps = { title: string }

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-2 py-2">
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label="Back"
        nativeButton={false}
        render={<Link to="/" />}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <h1 className="truncate text-xl font-semibold">{title}</h1>
    </header>
  )
}
