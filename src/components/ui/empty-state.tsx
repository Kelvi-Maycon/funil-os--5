import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card p-12 min-h-[400px] text-center shadow-sm w-full',
        className,
      )}
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-base mx-auto">
        {description}
      </p>
      {action}
    </div>
  )
}
