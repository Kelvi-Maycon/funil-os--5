import { useState, useRef, useEffect, useCallback } from 'react'
import { generateId } from '@/lib/generateId'
import { Node, Task } from '@/types'
import { cn } from '@/lib/utils'
import useTaskStore from '@/stores/useTaskStore'
import useFunnelStore from '@/stores/useFunnelStore'
import useDocumentStore from '@/stores/useDocumentStore'
import useAssetStore from '@/stores/useAssetStore'
import {
  Megaphone,
  LayoutTemplate,
  MessageCircle,
  Mail,
  DollarSign,
  HandHeart,
  CheckCircle,
  FileText,
  Settings,
  Trash2,
  Zap,
  MessageSquare,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  CheckSquare,
  Plus,
  PlayCircle,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'

const icons: Record<string, any> = {
  Ad: Megaphone,
  LandingPage: LayoutTemplate,
  Email: Mail,
  Checkout: DollarSign,
  Upsell: HandHeart,
  Obrigado: CheckCircle,
  Form: FileText,
  Slack: MessageSquare,
  SMS: MessageCircle,
  WATI: MessageCircle,
  ManyChat: MessageCircle,
  WaitUntil: Clock,
  Default: Zap,
  VSL: PlayCircle,
  Traffic: Megaphone,
  Goal: CheckCircle,
}

const getTypeTheme = (type: string) => {
  const themes: Record<string, { color: string; border: string; bg: string }> =
    {
      Ad: {
        color: 'hsl(var(--info))',
        border: 'hsl(var(--info))',
        bg: 'hsl(var(--info) / 0.1)',
      },
      LandingPage: {
        color: 'hsl(var(--primary))',
        border: 'hsl(var(--primary))',
        bg: 'hsl(var(--primary) / 0.1)',
      },
      Email: {
        color: 'hsl(var(--warning))',
        border: 'hsl(var(--warning))',
        bg: 'hsl(var(--warning) / 0.1)',
      },
      Checkout: {
        color: 'hsl(var(--success))',
        border: 'hsl(var(--success))',
        bg: 'hsl(var(--success) / 0.1)',
      },
      WaitUntil: {
        color: 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        bg: 'hsl(var(--muted))',
      },
      VSL: {
        color: 'hsl(var(--primary))',
        border: 'hsl(var(--primary))',
        bg: 'hsl(var(--primary) / 0.1)',
      },
      Slack: {
        color: 'hsl(var(--danger))',
        border: 'hsl(var(--danger))',
        bg: 'hsl(var(--danger) / 0.1)',
      },
      SMS: {
        color: 'hsl(var(--success))',
        border: 'hsl(var(--success))',
        bg: 'hsl(var(--success) / 0.1)',
      },
      WATI: {
        color: 'hsl(var(--success))',
        border: 'hsl(var(--success))',
        bg: 'hsl(var(--success) / 0.1)',
      },
      ManyChat: {
        color: 'hsl(var(--info))',
        border: 'hsl(var(--info))',
        bg: 'hsl(var(--info) / 0.1)',
      },
      Upsell: {
        color: 'hsl(var(--warning))',
        border: 'hsl(var(--warning))',
        bg: 'hsl(var(--warning) / 0.1)',
      },
      Obrigado: {
        color: 'hsl(var(--success))',
        border: 'hsl(var(--success))',
        bg: 'hsl(var(--success) / 0.1)',
      },
      Form: {
        color: 'hsl(var(--info))',
        border: 'hsl(var(--info))',
        bg: 'hsl(var(--info) / 0.1)',
      },
    }
  return (
    themes[type] || {
      color: 'hsl(var(--foreground))',
      border: 'hsl(var(--border))',
      bg: 'hsl(var(--muted))',
    }
  )
}

type NodeItemProps = {
  node: Node
  selected: boolean
  isNodeDragging: boolean
  snapToGrid?: boolean
  activeTool: string
  taskProgress: { total: number; completed: number }
  onPointerDownAction: (shiftKey: boolean) => void
  onMove: (dx: number, dy: number) => void
  onMoveEnd: (dx: number, dy: number) => void
  onResize?: (x: number, y: number, w: number, h: number) => void
  onResizeEnd?: (x: number, y: number, w: number, h: number) => void
  scale: number
  onOpenRightPanel: (tab: string) => void
  onOpenSettings: () => void
  onToggleComplete: () => void
  onDelete: () => void
  onAddChild: () => void
  onTextChange: (text: string) => void
  onEdgeDragStart: (nodeId: string, e: React.PointerEvent) => void
  onDropResource: (type: string, id: string) => void
}

export default function NodeItem({
  node,
  selected,
  isNodeDragging,
  snapToGrid,
  activeTool,
  taskProgress,
  onPointerDownAction,
  onMove,
  onMoveEnd,
  onResize,
  onResizeEnd,
  scale,
  onOpenRightPanel,
  onOpenSettings,
  onToggleComplete,
  onDelete,
  onAddChild,
  onTextChange,
  onEdgeDragStart,
  onDropResource,
}: NodeItemProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditingText, setIsEditingText] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const hasAutoSelected = useRef(false)

  const [tasks, setTasks] = useTaskStore()
  const [funnels] = useFunnelStore()
  const [documents] = useDocumentStore()
  const [assets] = useAssetStore()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  const callbacksRef = useRef({
    onPointerDownAction,
    onMove,
    onMoveEnd,
    onResize,
    onResizeEnd,
  })
  callbacksRef.current = {
    onPointerDownAction,
    onMove,
    onMoveEnd,
    onResize,
    onResizeEnd,
  }

  const funnel = funnels.find((f) => f.nodes.some((n) => n.id === node.id))

  const linkedTasks = tasks.filter(
    (t) => t.nodeId === node.id || node.data.linkedTaskIds?.includes(t.id),
  )

  const docIds = new Set(node.data.linkedDocumentIds || [])
  documents.forEach((d) => {
    if (d.nodeId === node.id) docIds.add(d.id)
  })
  const hasDocs = docIds.size > 0

  const assetIds = new Set(node.data.linkedAssetIds || [])
  assets.forEach((a) => {
    if ((a as any).nodeId === node.id) assetIds.add(a.id)
  })
  const hasAssets = assetIds.size > 0

  const hasTasks = linkedTasks.length > 0

  const isPanMode = activeTool === 'Pan'
  const isSelectMode = activeTool === 'Select'
  const currentlyDragging = isNodeDragging

  useEffect(() => {
    if (
      node.type === 'FloatingText' &&
      node.data.name === 'New Text' &&
      !hasAutoSelected.current
    ) {
      hasAutoSelected.current = true
      setIsEditingText(true)
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.focus()
          document.execCommand('selectAll', false, undefined)
        }
      }, 0)
    }
  }, [node.type, node.data.name])

  const handleToggleTask = useCallback(
    (task: Task) => {
      const newStatus = task.status === 'Concluído' ? 'A Fazer' : 'Concluído'
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
      )
    },
    [tasks, setTasks],
  )

  const handleAddTask = useCallback(() => {
    if (!newTaskTitle.trim()) {
      setIsAddingTask(false)
      return
    }
    const newTask: Task = {
      id: generateId('t'),
      title: newTaskTitle.trim(),
      projectId: funnel?.projectId || null,
      funnelId: funnel?.id,
      nodeId: node.id,
      priority: 'Média',
      status: 'A Fazer',
      deadline: new Date(Date.now() + 86400000).toISOString(),
    }
    setTasks([...tasks, newTask])
    setNewTaskTitle('')
    setIsAddingTask(false)
  }, [newTaskTitle, funnel?.projectId, funnel?.id, node.id, tasks, setTasks])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (
      isPanMode ||
      target.closest('button') ||
      target.closest('.interactive-icon') ||
      target.closest('[role="checkbox"]') ||
      target.closest('input') ||
      target.closest('.resize-handle') ||
      !isSelectMode
    )
      return
    e.stopPropagation()
    target.setPointerCapture(e.pointerId)
    callbacksRef.current.onPointerDownAction(e.shiftKey)
    document.body.style.userSelect = 'none'

    const startX = e.clientX,
      startY = e.clientY,
      initialNodeX = node.x,
      initialNodeY = node.y

    const handlePointerMove = (moveEv: PointerEvent) => {
      let dx = (moveEv.clientX - startX) / scale
      let dy = (moveEv.clientY - startY) / scale
      if (snapToGrid) {
        const snappedX = Math.round((initialNodeX + dx) / 28) * 28
        const snappedY = Math.round((initialNodeY + dy) / 28) * 28
        dx = snappedX - initialNodeX
        dy = snappedY - initialNodeY
      }
      callbacksRef.current.onMove(dx, dy)
    }

    const handlePointerUp = (upEv: PointerEvent) => {
      try {
        target.releasePointerCapture(upEv.pointerId)
      } catch (err) {
        /* ignore */
      }
      document.body.style.userSelect = ''
      let dx = (upEv.clientX - startX) / scale
      let dy = (upEv.clientY - startY) / scale
      if (snapToGrid) {
        const snappedX = Math.round((initialNodeX + dx) / 28) * 28
        const snappedY = Math.round((initialNodeY + dy) / 28) * 28
        dx = snappedX - initialNodeX
        dy = snappedY - initialNodeY
      }
      callbacksRef.current.onMoveEnd(dx, dy)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  const handleResizeStart = (e: React.PointerEvent, corner: string) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const target = e.target as HTMLElement
    target.setPointerCapture(e.pointerId)
    setIsResizing(true)
    callbacksRef.current.onPointerDownAction(e.shiftKey)
    document.body.style.userSelect = 'none'

    const startX = e.clientX,
      startY = e.clientY,
      initialX = node.x,
      initialY = node.y,
      initialW = node.width || 120,
      initialH = node.height || 120
    const isSquare = e.shiftKey

    const handlePointerMove = (moveEv: PointerEvent) => {
      let dx = (moveEv.clientX - startX) / scale,
        dy = (moveEv.clientY - startY) / scale
      let newX = initialX,
        newY = initialY,
        newW = initialW,
        newH = initialH

      if (corner.includes('e')) newW = Math.max(20, initialW + dx)
      if (corner.includes('s')) newH = Math.max(20, initialH + dy)
      if (corner.includes('w')) {
        const mw = Math.max(20, initialW - dx)
        newX = initialX + (initialW - mw)
        newW = mw
      }
      if (corner.includes('n')) {
        const mh = Math.max(20, initialH - dy)
        newY = initialY + (initialH - mh)
        newH = mh
      }

      if (isSquare) {
        const size = Math.max(newW, newH)
        newW = size
        newH = size
      }
      if (snapToGrid) {
        newX = Math.round(newX / 28) * 28
        newY = Math.round(newY / 28) * 28
        newW = Math.round(newW / 28) * 28
        newH = Math.round(newH / 28) * 28
      }
      callbacksRef.current.onResize?.(newX, newY, newW, newH)
    }

    const handlePointerUp = (upEv: PointerEvent) => {
      try {
        target.releasePointerCapture(upEv.pointerId)
      } catch (err) {
        /* ignore */
      }
      setIsResizing(false)
      document.body.style.userSelect = ''

      let dx = (upEv.clientX - startX) / scale,
        dy = (upEv.clientY - startY) / scale
      let newX = initialX,
        newY = initialY,
        newW = initialW,
        newH = initialH

      if (corner.includes('e')) newW = Math.max(20, initialW + dx)
      if (corner.includes('s')) newH = Math.max(20, initialH + dy)
      if (corner.includes('w')) {
        const mw = Math.max(20, initialW - dx)
        newX = initialX + (initialW - mw)
        newW = mw
      }
      if (corner.includes('n')) {
        const mh = Math.max(20, initialH - dy)
        newY = initialY + (initialH - mh)
        newH = mh
      }

      if (isSquare) {
        const size = Math.max(newW, newH)
        newW = size
        newH = size
      }
      if (snapToGrid) {
        newX = Math.round(newX / 28) * 28
        newY = Math.round(newY / 28) * 28
        newW = Math.round(newW / 28) * 28
        newH = Math.round(newH / 28) * 28
      }
      callbacksRef.current.onResizeEnd?.(newX, newY, newW, newH)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const resType = e.dataTransfer.getData('resourceType')
    const resId = e.dataTransfer.getData('resourceId')
    if (resType && resId) onDropResource(resType, resId)
  }

  if (node.type === 'FloatingText') {
    return (
      <div
        className={cn(
          'absolute top-0 left-0 pointer-events-auto min-w-[50px] p-2 z-10 group outline-none',
          selected && 'ring-2 ring-primary/60 shadow-lg rounded-md',
          !currentlyDragging && 'transition-transform duration-150',
          currentlyDragging
            ? 'opacity-95 z-50 cursor-grabbing shadow-xl ring-2 ring-primary/30 rounded-md'
            : isPanMode
              ? 'cursor-grab'
              : isSelectMode
                ? isEditingText
                  ? 'cursor-text'
                  : 'cursor-pointer'
                : '',
        )}
        style={{
          transform: `translate3d(${node.x}px, ${node.y}px, 0) scale(${currentlyDragging ? 1.02 : 1})`,
          color: node.style?.color || 'hsl(var(--foreground))',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        onPointerDown={(e) => {
          if (isEditingText) {
            e.stopPropagation()
            return
          }
          handlePointerDown(e)
        }}
        onDoubleClick={(e) => {
          if (!isPanMode && isSelectMode) {
            e.stopPropagation()
            setIsEditingText(true)
            setTimeout(() => {
              textRef.current?.focus()
              const selection = window.getSelection()
              const range = document.createRange()
              range.selectNodeContents(textRef.current!)
              selection?.removeAllRanges()
              selection?.addRange(range)
            }, 0)
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-node-id={node.id}
      >
        <div
          ref={textRef}
          className="font-bold text-base whitespace-pre-wrap outline-none min-h-[24px] min-w-[20px]"
          contentEditable={isEditingText}
          suppressContentEditableWarning
          onPointerDown={(e) => {
            if (isEditingText) e.stopPropagation()
          }}
          onBlur={(e) => {
            setIsEditingText(false)
            onTextChange(e.currentTarget.textContent || 'Text')
          }}
        >
          {node.data.name}
        </div>
      </div>
    )
  }

  if (
    [
      'Square',
      'Rectangle',
      'Circle',
      'Ellipse',
      'Diamond',
      'Arrow',
      'Line',
    ].includes(node.type)
  ) {
    const w = node.width || 120
    const h = node.height || 120
    const fill = node.style?.fill || 'transparent'
    const stroke = node.style?.stroke || 'hsl(var(--foreground))'
    const strokeW = node.style?.strokeWidth ?? 3
    const dash =
      node.style?.strokeDasharray === 'none'
        ? undefined
        : node.style?.strokeDasharray

    return (
      <div
        className={cn(
          'absolute top-0 left-0 pointer-events-auto flex items-center justify-center z-10 group text-foreground',
          selected && 'shadow-md ring-4 ring-primary/20 rounded-lg',
          !(currentlyDragging || isResizing) &&
            'transition-transform duration-150',
          currentlyDragging || isResizing
            ? 'opacity-95 z-50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] cursor-grabbing'
            : isPanMode
              ? 'cursor-grab'
              : isSelectMode
                ? 'cursor-pointer'
                : '',
        )}
        style={{
          transform: `translate3d(${node.x}px, ${node.y}px, 0) scale(${currentlyDragging || isResizing ? 1.02 : 1})`,
          width: w,
          height: h,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        onPointerDown={handlePointerDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-node-id={node.id}
      >
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          viewBox={`0 0 ${w} ${h}`}
        >
          {['Square', 'Rectangle'].includes(node.type) && (
            <rect
              x="2"
              y="2"
              width={w - 4}
              height={h - 4}
              rx={8}
              fill={fill}
              fillOpacity={node.style?.opacity ?? 1}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeDasharray={dash}
              filter="url(#roughpaper)"
              className={cn(
                'pointer-events-auto',
                selected && 'drop-shadow-md',
              )}
              style={{ transition: isResizing ? 'none' : 'all 0.15s' }}
            />
          )}
          {['Circle', 'Ellipse'].includes(node.type) && (
            <ellipse
              cx={w / 2}
              cy={h / 2}
              rx={w / 2 - 2}
              ry={h / 2 - 2}
              fill={fill}
              fillOpacity={node.style?.opacity ?? 1}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeDasharray={dash}
              filter="url(#roughpaper)"
              className={cn(
                'pointer-events-auto',
                selected && 'drop-shadow-md',
              )}
              style={{ transition: isResizing ? 'none' : 'all 0.15s' }}
            />
          )}
          {node.type === 'Diamond' && (
            <polygon
              points={`${w / 2},2 ${w - 2},${h / 2} ${w / 2},${h - 2} 2,${h / 2}`}
              fill={fill}
              fillOpacity={node.style?.opacity ?? 1}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeDasharray={dash}
              strokeLinejoin="round"
              filter="url(#roughpaper)"
              className={cn(
                'pointer-events-auto',
                selected && 'drop-shadow-md',
              )}
              style={{ transition: isResizing ? 'none' : 'all 0.15s' }}
            />
          )}
          {node.type === 'Arrow' && (
            <g
              fill="none"
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#roughpaper)"
              className={cn(
                'pointer-events-auto',
                selected && 'drop-shadow-md',
              )}
            >
              <path d={`M 2 ${h / 2} L ${w - 2} ${h / 2}`} />
              <path
                d={`M ${w - 20} ${h / 2 - 12} L ${w - 2} ${h / 2} L ${w - 20} ${h / 2 + 12}`}
              />
            </g>
          )}
          {node.type === 'Line' && (
            <line
              x1="2"
              y1="2"
              x2={w - 2}
              y2={h - 2}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinecap="round"
              filter="url(#roughpaper)"
              className={cn(
                'pointer-events-auto',
                selected && 'drop-shadow-md',
              )}
            />
          )}
        </svg>

        {selected && !isPanMode && isSelectMode && (
          <>
            <div className="absolute top-0 left-0 w-full h-full border border-primary/50 pointer-events-none rounded-sm" />
            {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((corner) => (
              <div
                key={corner}
                className={`resize-handle ${corner}-resize absolute w-3 h-3 bg-white border border-primary rounded-sm z-30`}
                style={{
                  top: corner.includes('n')
                    ? '-6px'
                    : corner.includes('s')
                      ? 'auto'
                      : '50%',
                  bottom: corner.includes('s') ? '-6px' : 'auto',
                  left: corner.includes('w')
                    ? '-6px'
                    : corner.includes('e')
                      ? 'auto'
                      : '50%',
                  right: corner.includes('e') ? '-6px' : 'auto',
                  transform:
                    corner.length === 1 ? 'translate(-50%, -50%)' : 'none',
                  cursor: `${corner}-resize`,
                }}
                onPointerDown={(e) => handleResizeStart(e, corner)}
              />
            ))}
          </>
        )}
      </div>
    )
  }

  if (node.type === 'Text') {
    return (
      <div
        className={cn(
          'absolute top-0 left-0 pointer-events-auto min-w-[150px] max-w-[400px] p-4 rounded-xl shadow-sm text-foreground z-10 group',
          selected && 'ring-2 ring-primary/60 shadow-md',
          !currentlyDragging && 'transition-transform duration-150',
          currentlyDragging
            ? 'opacity-95 z-50 cursor-grabbing shadow-xl ring-2 ring-primary/50'
            : isPanMode
              ? 'cursor-grab'
              : isSelectMode
                ? isEditingText
                  ? 'cursor-text'
                  : 'cursor-pointer'
                : '',
        )}
        style={{
          transform: `translate3d(${node.x}px, ${node.y}px, 0) scale(${currentlyDragging ? 1.02 : 1})`,
          transformOrigin: 'center center',
          backgroundColor: node.style?.fill || 'hsl(var(--card))',
          border: `1px solid ${node.style?.stroke || 'hsl(var(--border))'}`,
          willChange: 'transform',
        }}
        onPointerDown={(e) => {
          if (isEditingText) {
            e.stopPropagation()
            return
          }
          handlePointerDown(e)
        }}
        onDoubleClick={(e) => {
          if (!isPanMode && isSelectMode) {
            e.stopPropagation()
            setIsEditingText(true)
            setTimeout(() => textRef.current?.focus(), 0)
          }
        }}
      >
        <div
          ref={textRef}
          className="font-bold text-base whitespace-pre-wrap outline-none cursor-text"
          contentEditable={isEditingText}
          suppressContentEditableWarning
          onPointerDown={(e) => {
            if (isEditingText) e.stopPropagation()
          }}
          onBlur={(e) => {
            setIsEditingText(false)
            onTextChange(e.currentTarget.textContent || 'Text')
          }}
        >
          {node.data.name}
        </div>
      </div>
    )
  }

  if (node.type === 'Image') {
    return (
      <div
        className={cn(
          'absolute top-0 left-0 pointer-events-auto w-[300px] rounded-xl shadow-sm border border-border bg-white z-10 overflow-hidden group',
          selected && 'ring-4 ring-primary/40 border-primary shadow-md',
          !currentlyDragging && 'transition-transform duration-150',
          currentlyDragging
            ? 'opacity-95 z-50 cursor-grabbing shadow-xl ring-4 ring-primary/50'
            : isPanMode
              ? 'cursor-grab'
              : isSelectMode
                ? 'cursor-pointer'
                : '',
        )}
        style={{
          transform: `translate3d(${node.x}px, ${node.y}px, 0) scale(${currentlyDragging ? 1.02 : 1})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        onPointerDown={handlePointerDown}
        onDoubleClick={(e) => {
          if (!isPanMode && isSelectMode) {
            e.stopPropagation()
            onOpenRightPanel('assets')
          }
        }}
      >
        <img
          src={node.data.name}
          alt="Canvas"
          className="w-full h-auto object-cover pointer-events-none select-none"
        />
      </div>
    )
  }

  const customFill = node.style?.fill || node.data.color
  const customStroke = node.style?.stroke
  const Icon = icons[node.type] || icons.Default
  const theme = getTypeTheme(node.type)

  return (
    <div
      className={cn(
        'absolute top-0 left-0 pointer-events-auto w-[240px] rounded-xl px-6 py-4 z-10 flex flex-col group select-none duration-200 hover-lift',
        !currentlyDragging
          ? 'transition-[box-shadow,background-color,border-color,opacity,transform]'
          : 'transition-[box-shadow,background-color,border-color,opacity]',
        !customFill &&
          !customStroke &&
          'bg-card border border-border shadow-sm',
        isHovered && !selected && !customFill && 'shadow-md',
        selected && 'border-primary shadow-md ring-2 ring-primary/20',
        currentlyDragging && 'opacity-95 z-50 shadow-2xl',
        node.data.isCompleted && 'opacity-70 grayscale-[30%]',
      )}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0) scale(${currentlyDragging ? 1.03 : 1})`,
        cursor: isPanMode
          ? 'grab'
          : currentlyDragging
            ? 'grabbing'
            : isSelectMode
              ? 'pointer'
              : '',
        transformOrigin: 'center center',
        backgroundColor: customFill ? customFill : undefined,
        borderColor: customStroke
          ? customStroke
          : customFill
            ? customFill
            : undefined,
        borderStyle: 'solid',
        borderWidth: selected ? '2px' : '1px',
        borderLeftWidth: '6px',
        borderLeftColor: theme.border,
        willChange: 'transform',
      }}
      onPointerDown={handlePointerDown}
      onDoubleClick={(e) => {
        if (!isPanMode && isSelectMode) {
          e.stopPropagation()
          onOpenRightPanel('details')
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onDrop={handleDrop}
      data-node-id={node.id}
    >
      <div className="absolute -top-4 -left-4 flex items-center gap-2 z-30">
        {hasDocs && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-border shadow-sm text-primary cursor-help transition-transform hover:scale-110">
                <FileText size={14} strokeWidth={2.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">Documentos vinculados</TooltipContent>
          </Tooltip>
        )}
        {hasAssets && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-border shadow-sm text-primary cursor-help transition-transform hover:scale-110">
                <ImageIcon size={14} strokeWidth={2.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">Ativos vinculados</TooltipContent>
          </Tooltip>
        )}
        {hasTasks && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-border shadow-sm text-primary cursor-help transition-transform hover:scale-110">
                <CheckSquare size={14} strokeWidth={2.5} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">Tarefas associadas</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div
        className={cn(
          'absolute -top-4 right-2 flex items-center gap-2 z-30 transition-all duration-200 bg-card border border-border p-1 rounded-lg shadow-sm',
          selected || isHovered
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2 pointer-events-none',
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenSettings()
              }}
              className="interactive-icon w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Settings size={14} strokeWidth={2.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Configurações</TooltipContent>
        </Tooltip>
        <div className="w-px h-4 bg-border" />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="interactive-icon w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Excluir</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ backgroundColor: theme.bg, color: theme.color }}
        >
          <Icon size={14} strokeWidth={2.5} />
        </div>
        <span className="text-xs uppercase tracking-[0.08em] font-bold text-muted-foreground">
          {node.type}
        </span>
      </div>

      <div className="flex flex-col mb-1">
        <h4
          className={cn(
            'font-bold text-base truncate leading-tight transition-all text-foreground',
            node.data.isCompleted && 'line-through opacity-70',
          )}
        >
          {node.data.name}
        </h4>
        {node.data.subtitle && (
          <span className="text-sm mt-2 truncate font-medium text-muted-foreground">
            {node.data.subtitle}
          </span>
        )}
      </div>

      {node.data.isTaskMode && (
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
          {linkedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-2 group/task relative pr-4"
            >
              <Checkbox
                checked={task.status === 'Concluído'}
                onCheckedChange={() => handleToggleTask(task)}
                className="mt-0.5"
                aria-label={`Completar tarefa ${task.title}`}
              />
              <span
                className={cn(
                  'text-sm leading-tight font-bold flex-1 transition-all break-words',
                  task.status === 'Concluído'
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground',
                )}
              >
                {task.title}
              </span>
            </div>
          ))}
          {isAddingTask ? (
            <div className="flex items-center gap-2 mt-2">
              <input
                autoFocus
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTask()
                  }
                  if (e.key === 'Escape') {
                    setIsAddingTask(false)
                    setNewTaskTitle('')
                  }
                }}
                onBlur={() =>
                  newTaskTitle.trim() ? handleAddTask() : setIsAddingTask(false)
                }
                placeholder="Nome da tarefa..."
                className="flex-1 text-sm border rounded px-2 py-1 outline-none transition-all w-full font-bold bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsAddingTask(true)
              }}
              className="flex items-center gap-2 mt-2 text-sm font-bold transition-colors w-full text-left py-1 rounded-sm interactive-icon text-muted-foreground hover:text-primary"
            >
              <Plus size={14} strokeWidth={2.5} /> Adicionar tarefa
            </button>
          )}
        </div>
      )}

      {!isPanMode && isSelectMode && (
        <div
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-crosshair z-20 group/port interactive-icon opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={(e) => {
            e.stopPropagation()
            onEdgeDragStart(node.id, e)
          }}
        >
          <div className="w-3 h-3 rounded-full bg-white border-2 border-border group-hover/port:border-primary group-hover/port:bg-primary group-hover/port:scale-125 transition-all shadow-sm" />
        </div>
      )}

      <div
        className={cn(
          'absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center interactive-icon transition-all duration-200',
          selected || isHovered
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
      >
        <button
          className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 shadow-sm text-muted-foreground hover:text-primary hover:border-primary transition-all hover:scale-[1.02]"
          onClick={(e) => {
            e.stopPropagation()
            onAddChild()
          }}
        >
          <ExternalLink size={14} strokeWidth={2} />
          <span className="text-xs font-bold">Exit</span>
        </button>
      </div>
    </div>
  )
}
