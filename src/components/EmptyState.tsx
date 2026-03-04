import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state py-10">
      <div className="empty-state-icon">
        <Icon size={22} />
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-[13px] text-muted-foreground max-w-[260px] leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4 btn-primary text-xs h-8 px-4">
          <Plus size={14} className="mr-1.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
