import { Skeleton } from '@/components/ui/skeleton'

export function ResultsSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center gap-4 pt-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-20 w-24" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  )
}
