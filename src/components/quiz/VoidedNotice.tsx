import { Link, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function VoidedNotice() {
  const location = useLocation()

  return (
    <div className="flex flex-1 items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quiz stopped</CardTitle>
          <CardDescription>
            You left the app during the quiz, so this run doesn&apos;t count.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <Button nativeButton={false} render={<Link to={location.pathname + location.search} />}>
            Try again
          </Button>
          <Button variant="ghost" nativeButton={false} render={<Link to="/" />}>
            Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
