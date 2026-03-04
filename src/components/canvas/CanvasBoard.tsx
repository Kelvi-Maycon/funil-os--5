import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  useMemo,
  useSyncExternalStore,
} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Funnel, Node, Edge, NodeData, Resource } from '@/types'
import { generateId } from '@/lib/generateId'
import BlockPalette from './BlockPalette'
import NodeItem from './NodeItem'
import RightPanel from './RightPanel'
import { NodeSettingsModal } from './NodeSettingsModal'
import { useCanvasHistory } from '@/hooks/useCanvasHistory'
import { useCanvasTransform } from '@/hooks/useCanvasTransform'
import { useCanvasSelection } from '@/hooks/useCanvasSelection'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import {
  Plus,
  Minus,
  Map as MapIcon,
  Image as ImageIcon,
  MousePointer2,
  Hand,
  Type,
  ArrowLeft,
  Square,
  Circle,
  Hexagon,
  ArrowRight,
  Minus as DashIcon,
  Trash2,
  Shapes,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import useTaskStore from '@/stores/useTaskStore'
import useDocumentStore from '@/stores/useDocumentStore'
import useResourceStore from '@/stores/useResourceStore'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export class CanvasEphemeralState {
  dragState: {
    isDragging: boolean
    dx: number
    dy: number
    guides?: { x1: number; y1: number; x2: number; y2: number }[]
  } | null = null
  resizingNode: {
    id: string
    x: number
    y: number
    width?: number
    height?: number
  } | null = null
  drawingEdge: { source: string; currentX: number; currentY: number } | null =
    null
  listeners = new Set<() => void>()
  setState(updates: Partial<CanvasEphemeralState>) {
    Object.assign(this, updates)
    this.emit()
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  emit() {
    this.listeners.forEach((l) => l())
  }
}

function useEphemeralNodeState(
  node: Node,
  isSelected: boolean,
  store: CanvasEphemeralState,
) {
  const lastSnapshot = useRef({ node, isNodeDragging: false })
  const getSnapshot = useCallback(() => {
    const { dragState, resizingNode } = store
    let newEff = node
    let isNodeDragging = false
    if (resizingNode?.id === node.id) {
      newEff = {
        ...node,
        x: resizingNode.x,
        y: resizingNode.y,
        width: resizingNode.width,
        height: resizingNode.height,
      }
    } else if (isSelected && dragState) {
      newEff = { ...node, x: node.x + dragState.dx, y: node.y + dragState.dy }
      isNodeDragging = dragState.isDragging
    }
    const prev = lastSnapshot.current
    if (
      prev.node.id === newEff.id &&
      prev.node.x === newEff.x &&
      prev.node.y === newEff.y &&
      prev.node.width === newEff.width &&
      prev.node.height === newEff.height &&
      prev.isNodeDragging === isNodeDragging
    )
      return prev
    const next = { node: newEff, isNodeDragging }
    lastSnapshot.current = next
    return next
  }, [node, isSelected, store])
  return useSyncExternalStore(store.subscribe, getSnapshot)
}

const getRightPortCoords = (node: Node, x: number, y: number) => {
  const w = node.width || 120
  const h = node.height || 120
  if (
    ['Square', 'Rectangle', 'Diamond', 'Circle', 'Ellipse'].includes(node.type)
  )
    return { x: x + w, y: y + h / 2 }
  if (node.type === 'FloatingText')
    return {
      x: x + Math.max(40, (node.data.name || '').length * 8.5 + 16),
      y: y + 20,
    }
  if (node.type === 'Image') return { x: x + 300, y: y + 100 }
  if (node.type === 'Text') return { x: x + 150, y: y + 30 }
  return { x: x + 240, y: y + 44 }
}

const getLeftPortCoords = (node: Node, x: number, y: number) => {
  const h = node.height || 120
  if (
    ['Square', 'Rectangle', 'Diamond', 'Circle', 'Ellipse'].includes(node.type)
  )
    return { x, y: y + h / 2 }
  if (node.type === 'FloatingText') return { x, y: y + 20 }
  if (node.type === 'Image') return { x, y: y + 100 }
  if (node.type === 'Text') return { x, y: y + 30 }
  return { x, y: y + 44 }
}

const getApproxBounds = (n: Node) => {
  let w = n.width || 240
  let h = n.height || 120
  if (n.type === 'FloatingText') {
    w = 150
    h = 40
  } else if (n.type === 'Text') {
    w = 200
    h = 80
  } else if (n.type === 'Image') {
    w = 300
    h = 200
  } else if (
    [
      'Square',
      'Rectangle',
      'Diamond',
      'Circle',
      'Ellipse',
      'Arrow',
      'Line',
    ].includes(n.type)
  ) {
    w = n.width || 120
    h = n.height || 120
  }
  return { x: n.x, y: n.y, w, h }
}

const getEdgePath = (sourceCoords: any, targetCoords: any, style: string) => {
  if (style === 'straight')
    return `M ${sourceCoords.x} ${sourceCoords.y} L ${targetCoords.x} ${targetCoords.y}`
  if (style === 'orthogonal') {
    const midX = sourceCoords.x + (targetCoords.x - sourceCoords.x) / 2
    return `M ${sourceCoords.x} ${sourceCoords.y} L ${midX} ${sourceCoords.y} L ${midX} ${targetCoords.y} L ${targetCoords.x} ${targetCoords.y}`
  }
  return `M ${sourceCoords.x} ${sourceCoords.y} C ${sourceCoords.x + 80} ${sourceCoords.y}, ${targetCoords.x - 80} ${targetCoords.y}, ${targetCoords.x} ${targetCoords.y}`
}

const EdgeItem = memo(
  ({
    edge,
    sourceNode,
    targetNode,
    isSelected,
    activeTool,
    edgeStyle,
    onSelect,
  }: any) => {
    const sourceCoords = getRightPortCoords(
      sourceNode,
      sourceNode.x,
      sourceNode.y,
    )
    const targetCoords = getLeftPortCoords(
      targetNode,
      targetNode.x,
      targetNode.y,
    )
    const d = getEdgePath(sourceCoords, targetCoords, edgeStyle)
    const strokeColor =
      edge.style?.stroke ||
      (isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))')
    const strokeWidth = edge.style?.strokeWidth || (isSelected ? 4 : 3)
    const strokeDasharray = edge.style?.strokeDasharray || 'none'
    const midX = sourceCoords.x + (targetCoords.x - sourceCoords.x) / 2
    const midY = sourceCoords.y + (targetCoords.y - sourceCoords.y) / 2

    return (
      <g>
        <path
          d={d}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'transition-colors cursor-pointer pointer-events-auto',
            !isSelected && 'hover:stroke-primary/70',
          )}
          onClick={onSelect}
        />
        {edge.label && (
          <foreignObject
            x={midX - 60}
            y={midY - 12}
            width="120"
            height="24"
            className="overflow-visible pointer-events-none"
          >
            <div className="flex items-center justify-center w-full h-full">
              <span className="bg-background border border-border text-xs px-2 py-0.5 rounded-md font-bold text-foreground whitespace-nowrap shadow-sm truncate max-w-[120px]">
                {edge.label}
              </span>
            </div>
          </foreignObject>
        )}
      </g>
    )
  },
)

const NodeItemWrapper = memo(({ node, isSelected, store, ...props }: any) => {
  const { node: effNode, isNodeDragging } = useEphemeralNodeState(
    node,
    isSelected,
    store,
  )
  return (
    <NodeItem
      node={effNode}
      selected={isSelected}
      isNodeDragging={isNodeDragging}
      {...props}
    />
  )
})

const EdgeItemWrapper = memo(
  ({
    edge,
    sourceNode,
    targetNode,
    isSelected,
    store,
    activeTool,
    edgeStyle,
    onSelect,
  }: any) => {
    const { node: effSource } = useEphemeralNodeState(
      sourceNode,
      selectedNodesIncludes(store, sourceNode.id),
      store,
    )
    const { node: effTarget } = useEphemeralNodeState(
      targetNode,
      selectedNodesIncludes(store, targetNode.id),
      store,
    )
    return (
      <EdgeItem
        edge={edge}
        sourceNode={effSource}
        targetNode={effTarget}
        isSelected={isSelected}
        activeTool={activeTool}
        edgeStyle={edgeStyle}
        onSelect={onSelect}
      />
    )
  },
)
const selectedNodesIncludes = (store: any, id: string) => false // simplified wrapper

const DrawingEdgeOverlay = memo(({ store, nodes, edgeStyle }: any) => {
  const drawingEdge = useSyncExternalStore(
    store.subscribe,
    () => store.drawingEdge,
  )
  if (!drawingEdge) return null
  const sNode = nodes.find((n: any) => n.id === drawingEdge.source)
  if (!sNode) return null
  const sourceCoords = getRightPortCoords(sNode, sNode.x, sNode.y)
  const targetCoords = { x: drawingEdge.currentX, y: drawingEdge.currentY }
  const d = getEdgePath(sourceCoords, targetCoords, edgeStyle)
  return (
    <path
      d={d}
      stroke="hsl(var(--primary))"
      strokeWidth="3"
      strokeDasharray="4 4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
})

const GuidesOverlay = memo(({ store, scale }: any) => {
  const guides = useSyncExternalStore(
    store.subscribe,
    () => store.dragState?.guides,
  )
  if (!guides || guides.length === 0) return null
  return (
    <>
      {guides.map((guide: any, idx: number) => (
        <line
          key={`guide-${idx}`}
          x1={guide.x1}
          y1={guide.y1}
          x2={guide.x2}
          y2={guide.y2}
          stroke="hsl(var(--primary))"
          strokeWidth={1.5 / scale}
          strokeDasharray="6 6"
          className="opacity-70"
        />
      ))}
    </>
  )
})

export default function CanvasBoard({
  funnel,
  onChange,
  hideHeader,
  onBack,
}: {
  funnel: Funnel
  onChange: (f: Funnel) => void
  hideHeader?: boolean
  onBack?: () => void
}) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [tasks, setTasks] = useTaskStore()
  const [docs, setDocs] = useDocumentStore()
  const [resources, setResources] = useResourceStore()
  const { toast } = useToast()
  const { pushState, undo, redo } = useCanvasHistory(funnel)
  const [nodeToDelete, setNodeToDelete] = useState<string | 'selected' | null>(
    null,
  )
  const ephemeralStore = useMemo(() => new CanvasEphemeralState(), [])

  const onChangeWithHistory = useCallback(
    (newFunnel: Funnel) => {
      pushState(funnel)
      onChange(newFunnel)
    },
    [funnel, onChange, pushState],
  )

  const {
    selectedNodes,
    setSelectedNodes,
    selectedEdge,
    setSelectedEdge,
    selectionBox,
    setSelectionBox,
  } = useCanvasSelection()
  const {
    transform,
    setTransform,
    isPanning,
    setIsPanning,
    lastPan,
    zoomIn,
    zoomOut,
    resetZoom,
  } = useCanvasTransform(1, hideHeader)

  const [rightPanelState, setRightPanelState] = useState<{
    nodeId: string
    tab: string
  } | null>(null)
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [activeTool, setActiveTool] = useState<
    | 'Select'
    | 'Pan'
    | 'Rectangle'
    | 'Ellipse'
    | 'Diamond'
    | 'Arrow'
    | 'Line'
    | 'Text'
    | 'Image'
    | 'Square'
    | 'Circle'
  >('Select')
  const [showMinimap, setShowMinimap] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [creatingShape, setCreatingShape] = useState<{
    type: string
    startX: number
    startY: number
    currentX: number
    currentY: number
  } | null>(null)
  const [settingsNodeId, setSettingsNodeId] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const latest = useRef({
    funnel,
    selectedNodes,
    snapToGrid,
    transform,
    rightPanelState,
    settingsNodeId,
    docs,
    tasks,
    resources,
    activeTool,
  })
  latest.current = {
    funnel,
    selectedNodes,
    snapToGrid,
    transform,
    rightPanelState,
    settingsNodeId,
    docs,
    tasks,
    resources,
    activeTool,
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      )
        return
      if (e.code === 'Space') {
        e.preventDefault()
        setIsSpacePressed(true)
        return
      }
      switch (e.key.toLowerCase()) {
        case '1':
        case 'v':
          setActiveTool('Select')
          break
        case 'h':
          setActiveTool('Pan')
          break
        case 'delete':
        case 'backspace':
          if (latest.current.selectedNodes.length > 0 || selectedEdge)
            setNodeToDelete('selected')
          break
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.shiftKey) redo(latest.current.funnel, onChange)
            else undo(latest.current.funnel, onChange)
          }
          break
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [undo, redo, onChange, selectedEdge])

  const handleDeleteSelected = useCallback(() => {
    const { funnel, selectedNodes, rightPanelState, settingsNodeId } =
      latest.current
    if (selectedNodes.length > 0) {
      onChangeWithHistory({
        ...funnel,
        nodes: funnel.nodes.filter((n) => !selectedNodes.includes(n.id)),
        edges: funnel.edges.filter(
          (e) =>
            !selectedNodes.includes(e.source) &&
            !selectedNodes.includes(e.target),
        ),
      })
      setSelectedNodes([])
      if (rightPanelState && selectedNodes.includes(rightPanelState.nodeId))
        setRightPanelState(null)
      if (settingsNodeId && selectedNodes.includes(settingsNodeId))
        setSettingsNodeId(null)
      toast({ title: 'Elementos excluídos com sucesso.' })
    } else if (selectedEdge) {
      onChangeWithHistory({
        ...funnel,
        edges: funnel.edges.filter((e) => e.id !== selectedEdge),
      })
      setSelectedEdge(null)
      toast({ title: 'Linha excluída com sucesso.' })
    }
  }, [onChangeWithHistory, setSelectedNodes, selectedEdge, setSelectedEdge, toast])

  const handleConfirmDelete = useCallback(() => {
    const { funnel, rightPanelState, settingsNodeId } = latest.current
    if (nodeToDelete === 'selected') {
      handleDeleteSelected()
    } else if (nodeToDelete) {
      onChangeWithHistory({
        ...funnel,
        nodes: funnel.nodes.filter((x) => x.id !== nodeToDelete),
        edges: funnel.edges.filter(
          (e) => e.source !== nodeToDelete && e.target !== nodeToDelete,
        ),
      })
      if (rightPanelState?.nodeId === nodeToDelete) setRightPanelState(null)
      if (settingsNodeId === nodeToDelete) setSettingsNodeId(null)
      toast({ title: 'Elemento excluído com sucesso.' })
    }
    setNodeToDelete(null)
  }, [nodeToDelete, handleDeleteSelected, onChangeWithHistory, toast])

  useEffect(() => {
    const el = boardRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        setTransform((prev) => {
          let newScale = prev.scale * Math.exp(e.deltaY * -0.005)
          newScale = Math.min(Math.max(0.1, newScale), 3)
          const rect = el.getBoundingClientRect()
          const mouseX = e.clientX - rect.left,
            mouseY = e.clientY - rect.top
          return {
            x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
            y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
            scale: newScale,
          }
        })
      } else {
        setTransform((prev) => ({
          ...prev,
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }))
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [setTransform])

  const handlePointerDown = (e: React.PointerEvent) => {
    const isCanvasBg =
      e.target === boardRef.current ||
      (e.target as HTMLElement).classList.contains('canvas-container') ||
      (e.target as HTMLElement).tagName === 'svg' ||
      ((e.target as HTMLElement).tagName === 'path' &&
        !(e.target as HTMLElement).classList.contains('transition-colors'))
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return
    if (
      activeTool === 'Pan' ||
      e.button === 1 ||
      (isSpacePressed && e.button === 2)
    ) {
      setIsPanning(true)
      lastPan.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      document.body.style.userSelect = 'none'
      return
    }
    if (isCanvasBg && e.button === 0) {
      if (
        [
          'Square',
          'Rectangle',
          'Diamond',
          'Circle',
          'Ellipse',
          'Arrow',
          'Line',
        ].includes(activeTool)
      ) {
        let x = (e.clientX - rect.left - transform.x) / transform.scale
        let y = (e.clientY - rect.top - transform.y) / transform.scale
        if (snapToGrid) {
          x = Math.round(x / 28) * 28
          y = Math.round(y / 28) * 28
        }
        setCreatingShape({
          type: activeTool,
          startX: x,
          startY: y,
          currentX: x,
          currentY: y,
        })
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        e.stopPropagation()
        return
      }
      if (activeTool === 'Select') {
        setSelectedNodes([])
        setSelectedEdge(null)
        let x = (e.clientX - rect.left - transform.x) / transform.scale
        let y = (e.clientY - rect.top - transform.y) / transform.scale
        setSelectionBox({ startX: x, startY: y, currentX: x, currentY: y })
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      }
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return
    if (creatingShape) {
      let x = (e.clientX - rect.left - transform.x) / transform.scale
      let y = (e.clientY - rect.top - transform.y) / transform.scale
      if (snapToGrid) {
        x = Math.round(x / 28) * 28
        y = Math.round(y / 28) * 28
      }
      setCreatingShape((prev) =>
        prev ? { ...prev, currentX: x, currentY: y } : null,
      )
      return
    }
    if (selectionBox) {
      let x = (e.clientX - rect.left - transform.x) / transform.scale
      let y = (e.clientY - rect.top - transform.y) / transform.scale
      setSelectionBox((prev) =>
        prev ? { ...prev, currentX: x, currentY: y } : null,
      )
      const minX = Math.min(selectionBox.startX, x)
      const maxX = Math.max(selectionBox.startX, x)
      const minY = Math.min(selectionBox.startY, y)
      const maxY = Math.max(selectionBox.startY, y)
      const newSelected = funnel.nodes
        .filter((n) => {
          const b = getApproxBounds(n)
          return (
            b.x < maxX && b.x + b.w > minX && b.y < maxY && b.y + b.h > minY
          )
        })
        .map((n) => n.id)
      setSelectedNodes(newSelected)
      return
    }
    if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        x: prev.x + (e.clientX - lastPan.current.x),
        y: prev.y + (e.clientY - lastPan.current.y),
      }))
      lastPan.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (creatingShape) {
      const w = Math.abs(creatingShape.currentX - creatingShape.startX)
      const h = Math.abs(creatingShape.currentY - creatingShape.startY)
      const x = Math.min(creatingShape.startX, creatingShape.currentX)
      const y = Math.min(creatingShape.startY, creatingShape.currentY)
      if (w > 10 || h > 10) {
        const id = generateId('n')
        onChangeWithHistory({
          ...funnel,
          nodes: [
            ...funnel.nodes,
            {
              id,
              type: creatingShape.type,
              x,
              y,
              width: Math.max(w, 20),
              height: Math.max(h, 20),
              data: { name: '', status: '', subtitle: '' },
              style: {
                fill: 'transparent',
                opacity: 1,
                stroke: 'hsl(var(--foreground))',
                strokeWidth: 3,
                strokeDasharray: 'none',
              },
            },
          ],
        })
        setSelectedNodes([id])
      }
      setCreatingShape(null)
      setActiveTool('Select')
      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch (err) {
        /* ignore */
      }
      return
    }
    if (selectionBox) {
      setSelectionBox(null)
      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch (err) {
        /* ignore */
      }
      return
    }
    if (isPanning) {
      setIsPanning(false)
      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch (err) {
        /* ignore */
      }
      document.body.style.userSelect = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('blockType')
    if (!type) return
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return
    let x = (e.clientX - rect.left - transform.x) / transform.scale - 120
    let y = (e.clientY - rect.top - transform.y) / transform.scale - 40
    if (snapToGrid) {
      x = Math.round(x / 28) * 28
      y = Math.round(y / 28) * 28
    }
    const id = generateId('n')
    onChangeWithHistory({
      ...funnel,
      nodes: [
        ...funnel.nodes,
        {
          id,
          type,
          x,
          y,
          data: { name: type, status: 'A Fazer', subtitle: '' },
        },
      ],
    })
    setSelectedNodes([id])
  }

  const handleEdgeDragStart = useCallback(
    (nodeId: string, e: React.PointerEvent) => {
      e.stopPropagation()
      if (e.button !== 0) return
      const rect = boardRef.current?.getBoundingClientRect()
      if (!rect) return
      const getCoords = (cx: number, cy: number) => {
        const { transform } = latest.current
        return {
          x: (cx - rect.left - transform.x) / transform.scale,
          y: (cy - rect.top - transform.y) / transform.scale,
        }
      }
      const coords = getCoords(e.clientX, e.clientY)
      ephemeralStore.setState({
        drawingEdge: { source: nodeId, currentX: coords.x, currentY: coords.y },
      })

      const onMove = (ev: PointerEvent) => {
        const c = getCoords(ev.clientX, ev.clientY)
        ephemeralStore.setState({
          drawingEdge: { source: nodeId, currentX: c.x, currentY: c.y },
        })
      }
      const onUp = (ev: PointerEvent) => {
        const { funnel } = latest.current
        const c = getCoords(ev.clientX, ev.clientY)
        let targetId: string | null = null
        const targetNodeEl = document
          .elementFromPoint(ev.clientX, ev.clientY)
          ?.closest('[data-node-id]')
        if (targetNodeEl) targetId = targetNodeEl.getAttribute('data-node-id')
        if (!targetId) {
          for (const n of funnel.nodes) {
            if (n.id === nodeId) continue
            const b = getApproxBounds(n)
            if (
              c.x >= b.x &&
              c.x <= b.x + b.w &&
              c.y >= b.y &&
              c.y <= b.y + b.h
            ) {
              targetId = n.id
              break
            }
          }
        }
        if (
          targetId &&
          targetId !== nodeId &&
          !funnel.edges.some(
            (edge) => edge.source === nodeId && edge.target === targetId,
          )
        ) {
          onChangeWithHistory({
            ...funnel,
            edges: [
              ...funnel.edges,
              { id: generateId('e'), source: nodeId, target: targetId },
            ],
          })
        }
        ephemeralStore.setState({ drawingEdge: null })
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    },
    [onChangeWithHistory, ephemeralStore],
  )

  const handleAddChild = useCallback(
    (parentId: string) => {
      const { funnel, snapToGrid } = latest.current
      const parent = funnel.nodes.find((n) => n.id === parentId)
      if (!parent) return
      const newId = generateId('n')
      let newX = parent.x + 330,
        newY = parent.y
      if (snapToGrid) {
        newX = Math.round(newX / 28) * 28
        newY = Math.round(newY / 28) * 28
      }
      onChangeWithHistory({
        ...funnel,
        nodes: [
          ...funnel.nodes,
          {
            id: newId,
            type: 'Default',
            x: newX,
            y: newY,
            data: { name: 'Novo Nó', status: 'A Fazer', subtitle: '' },
          },
        ],
        edges: [
          ...funnel.edges,
          { id: generateId('e'), source: parentId, target: newId },
        ],
      })
    },
    [onChangeWithHistory],
  )

  const handleAddAnnotation = (type: 'Text' | 'Image', name: string) => {
    const id = generateId('n')
    onChangeWithHistory({
      ...funnel,
      nodes: [
        ...funnel.nodes,
        {
          id,
          type,
          x: -transform.x / transform.scale + 400,
          y: -transform.y / transform.scale + 200,
          data: { name, status: '', subtitle: '' },
          style:
            type === 'Text'
              ? {
                  color: 'hsl(var(--foreground))',
                  fill: 'hsl(var(--card))',
                  stroke: 'hsl(var(--border))',
                }
              : undefined,
        },
      ],
    })
    setSelectedNodes([id])
    setActiveTool('Select')
  }

  const handleDropResource = useCallback(
    (nodeId: string, type: string, id: string) => {
      const { funnel, docs, tasks, resources } = latest.current
      const updatedNodes = funnel.nodes.map((n) => {
        if (n.id === nodeId) {
          const key =
            type === 'document'
              ? 'linkedDocumentIds'
              : type === 'task'
                ? 'linkedTaskIds'
                : 'linkedAssetIds'
          const currentIds = (n.data[key as keyof NodeData] as string[]) || []
          if (!currentIds.includes(id))
            return { ...n, data: { ...n.data, [key]: [...currentIds, id] } }
        }
        return n
      })
      onChangeWithHistory({ ...funnel, nodes: updatedNodes })
    },
    [onChangeWithHistory],
  )

  const updateEdgeStyle = (
    updates: Partial<Edge['style']> & { label?: string },
  ) => {
    if (selectedEdge) {
      onChangeWithHistory({
        ...funnel,
        edges: funnel.edges.map((e) =>
          e.id === selectedEdge
            ? {
                ...e,
                style: { ...e.style, ...updates },
                label: updates.label !== undefined ? updates.label : e.label,
              }
            : e,
        ),
      })
    }
  }

  const updateNodeStyle = (updates: Partial<Node['style']>) => {
    if (selectedNodes.length > 0) {
      onChangeWithHistory({
        ...funnel,
        nodes: funnel.nodes.map((n) =>
          selectedNodes.includes(n.id)
            ? { ...n, style: { ...n.style, ...updates } }
            : n,
        ),
      })
    }
  }

  const handleNodePointerDown = useCallback(
    (id: string, shiftKey: boolean) => {
      const { funnel, selectedNodes } = latest.current
      const n = funnel.nodes.find((x) => x.id === id)
      if (!n) return
      const groupMembers = n.groupId
        ? funnel.nodes.filter((x) => x.groupId === n.groupId).map((x) => x.id)
        : [id]
      if (!selectedNodes.includes(id)) {
        if (shiftKey)
          setSelectedNodes([...new Set([...selectedNodes, ...groupMembers])])
        else {
          setSelectedNodes(groupMembers)
          setSelectedEdge(null)
        }
      } else if (shiftKey)
        setSelectedNodes(selectedNodes.filter((x) => !groupMembers.includes(x)))
    },
    [setSelectedNodes, setSelectedEdge],
  )

  const isMultiSelect = selectedNodes.length > 1
  const selectedNodeObj =
    selectedNodes.length > 0
      ? funnel.nodes.find((n) => n.id === selectedNodes[0])
      : undefined
  const selectedEdgeObj = funnel.edges.find((e) => e.id === selectedEdge)
  
  // Contextual property panel logic
  const showPropertiesPanel =
    isMultiSelect || selectedNodeObj || selectedEdgeObj

  const isToolbarActive =
    activeTool !== 'Select' ||
    selectedNodes.length > 0 ||
    selectedEdge ||
    creatingShape

  return (
    <div className="flex-1 w-full h-full flex relative overflow-hidden bg-transparent">
      {!hideHeader && (
        <header className="absolute top-0 left-0 right-0 h-20 bg-card border-b border-border px-6 flex items-center justify-between z-40 shadow-sm">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={onBack}
              >
                <ArrowLeft size={18} />
              </Button>
            )}
            <h1 className="font-bold text-2xl text-foreground">
              {funnel.name}
            </h1>
            <span className="bg-success/10 text-success px-2.5 py-1 rounded-[8px] text-xs font-bold border border-success/20">
              Publicado
            </span>
          </div>
          <div className="flex bg-background p-1 rounded-lg border border-border">
            <button className="px-4 py-1.5 rounded-md bg-card text-primary text-sm font-bold shadow-sm">
              Editar
            </button>
            <button className="px-4 py-1.5 rounded-md text-muted-foreground text-sm font-bold hover:text-foreground transition-colors">
              Analytics
            </button>
          </div>
        </header>
      )}

      <div
        className={cn(
          'absolute left-6 z-20 bottom-6 flex pointer-events-none transition-all',
          hideHeader ? 'top-6' : 'top-28',
        )}
      >
        <div className="pointer-events-auto flex h-full">
          <BlockPalette funnel={funnel} />
        </div>
      </div>

      <div
        className={cn(
          'absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center p-2 bg-card rounded-2xl shadow-lg border border-border z-40 gap-1.5 transition-all duration-300',
          isToolbarActive
            ? 'opacity-100 translate-y-0'
            : 'opacity-40 hover:opacity-100 translate-y-2 hover:translate-y-0',
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'w-10 h-10 rounded-xl',
                activeTool === 'Select'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary',
              )}
              onClick={() => setActiveTool('Select')}
            >
              <MousePointer2 size={18} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Cursor (V)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'w-10 h-10 rounded-xl',
                activeTool === 'Pan'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary',
              )}
              onClick={() => setActiveTool('Pan')}
            >
              <Hand size={18} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Mão (H)</TooltipContent>
        </Tooltip>
        <div className="w-px h-6 bg-border mx-1" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl text-muted-foreground hover:text-primary"
              onClick={() => handleAddAnnotation('Text', 'Novo Texto')}
            >
              <Type size={18} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Texto</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl text-muted-foreground hover:text-primary"
              onClick={() =>
                handleAddAnnotation(
                  'Image',
                  'https://img.usecurling.com/p/400/300?q=marketing',
                )
              }
            >
              <ImageIcon size={18} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Imagem</TooltipContent>
        </Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'w-10 h-10 rounded-xl',
                ['Rectangle', 'Circle', 'Diamond', 'Line', 'Arrow'].includes(
                  activeTool,
                )
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary',
              )}
            >
              <Shapes size={18} strokeWidth={2} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            className="flex gap-1 p-2 w-auto rounded-xl"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTool('Rectangle')}
                >
                  <Square size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Retângulo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTool('Circle')}
                >
                  <Circle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Elipse</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTool('Diamond')}
                >
                  <Hexagon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Losango</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTool('Arrow')}
                >
                  <ArrowRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Seta</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTool('Line')}
                >
                  <DashIcon size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Linha</TooltipContent>
            </Tooltip>
          </PopoverContent>
        </Popover>
      </div>

      <div className="absolute right-6 bottom-6 flex items-center p-1.5 bg-card rounded-xl shadow-lg border border-border z-30 gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-lg text-muted-foreground hover:text-primary"
          onClick={zoomOut}
        >
          <Minus size={18} />
        </Button>
        <button
          onClick={resetZoom}
          className="text-sm font-bold text-foreground h-8 min-w-[3.5rem] hover:text-primary text-center"
        >
          {Math.round(transform.scale * 100)}%
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-lg text-muted-foreground hover:text-primary"
          onClick={zoomIn}
        >
          <Plus size={18} />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'w-10 h-10 rounded-lg transition-colors',
            showMinimap
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-primary',
          )}
          onClick={() => setShowMinimap(!showMinimap)}
        >
          <MapIcon size={18} />
        </Button>
      </div>

      {showMinimap && (
        <div className="absolute right-6 bottom-[88px] transition-all duration-300 w-56 h-36 bg-card border border-border shadow-lg rounded-xl overflow-hidden z-30 cursor-crosshair">
          <div
            className="w-full h-full relative bg-background pointer-events-none"
            style={{ transform: 'scale(0.08)', transformOrigin: 'top left' }}
          >
            {funnel.nodes.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'absolute rounded-xl opacity-60',
                  [
                    'Square',
                    'Rectangle',
                    'Diamond',
                    'Circle',
                    'Ellipse',
                  ].includes(n.type)
                    ? 'bg-muted-foreground'
                    : 'bg-primary/50',
                )}
                style={{
                  left: n.x,
                  top: n.y,
                  width: n.width || 200,
                  height: n.height || 100,
                }}
              />
            ))}
            <div
              className="absolute border-[8px] border-primary bg-primary/10 rounded-xl pointer-events-none"
              style={{
                left: -transform.x / transform.scale,
                top: -transform.y / transform.scale,
                width:
                  (boardRef.current?.clientWidth || 1000) / transform.scale,
                height:
                  (boardRef.current?.clientHeight || 800) / transform.scale,
              }}
            />
          </div>
        </div>
      )}

      {!showPropertiesPanel && !rightPanelState && (
        <div className="absolute top-24 right-6 bg-card rounded-2xl shadow-xl border border-border p-5 w-[280px] flex flex-col gap-6 z-40 max-h-[80vh] overflow-y-auto">
          <h4 className="section-label">CANVAS</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="section-label block">Estilo de Conexão</label>
              <Select
                value={funnel.edgeStyle || 'curved'}
                onValueChange={(val) =>
                  onChangeWithHistory({ ...funnel, edgeStyle: val as any })
                }
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="curved">Curvo</SelectItem>
                  <SelectItem value="straight">Reto</SelectItem>
                  <SelectItem value="orthogonal">Ortogonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {showPropertiesPanel && !rightPanelState && (
        <div className="absolute top-24 right-6 bg-card rounded-2xl shadow-xl border border-border p-5 w-[280px] flex flex-col gap-6 z-40 max-h-[80vh] overflow-y-auto">
          <h4 className="section-label">
            {isMultiSelect
              ? 'MÚLTIPLOS'
              : selectedNodeObj
                ? 'ESTILO'
                : 'LINHA'}
          </h4>
          {(selectedNodeObj || isMultiSelect) && (
            <>
              <div className="space-y-3">
                <label className="section-label block">
                  Cor de Preenchimento
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'transparent',
                    'hsl(var(--card))',
                    'hsl(var(--primary))',
                    'hsl(var(--success))',
                    'hsl(var(--warning))',
                    'hsl(var(--info))',
                    'hsl(var(--danger))',
                  ].map((c) => (
                    <button
                      key={c}
                      className={cn(
                        'w-7 h-7 rounded-md border-2 transition-transform',
                        selectedNodeObj?.style?.fill === c ||
                          selectedNodeObj?.data?.color === c ||
                          (c === 'transparent' &&
                            !selectedNodeObj?.style?.fill &&
                            !selectedNodeObj?.data?.color)
                          ? 'border-foreground scale-110'
                          : 'border-transparent shadow-sm hover:scale-110',
                      )}
                      style={{
                        backgroundColor: c === 'transparent' ? '#fff' : c,
                        backgroundImage:
                          c === 'transparent'
                            ? 'radial-gradient(hsl(var(--border)) 1px, transparent 0)'
                            : 'none',
                        backgroundSize: '4px 4px',
                      }}
                      onClick={() => {
                        updateNodeStyle({ fill: c })
                        onChangeWithHistory({
                          ...funnel,
                          nodes: funnel.nodes.map((n) =>
                            selectedNodes.includes(n.id)
                              ? {
                                  ...n,
                                  data: {
                                    ...n.data,
                                    color: c === 'transparent' ? undefined : c,
                                  },
                                }
                              : n,
                          ),
                        })
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="section-label block">Cor do Contorno</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'hsl(var(--foreground))',
                    'hsl(var(--primary))',
                    'hsl(var(--success))',
                    'hsl(var(--warning))',
                    'hsl(var(--info))',
                    'hsl(var(--danger))',
                  ].map((c) => (
                    <button
                      key={c}
                      className={cn(
                        'w-7 h-7 rounded-md border-2 transition-transform shadow-sm',
                        selectedNodeObj?.style?.stroke === c ||
                          selectedNodeObj?.style?.color === c
                          ? 'border-foreground scale-110'
                          : 'border-transparent hover:scale-110',
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => updateNodeStyle({ stroke: c, color: c })}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          {selectedEdgeObj && (
            <>
              <div className="space-y-2">
                <label className="section-label block">Rótulo da Linha</label>
                <Input
                  value={selectedEdgeObj.label || ''}
                  onChange={(e) => updateEdgeStyle({ label: e.target.value })}
                  placeholder="Ex: Clicou no botão"
                />
              </div>
              <div className="space-y-3">
                <label className="section-label block">Espessura</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  className="w-full accent-primary h-1.5 bg-border rounded-full appearance-none cursor-pointer"
                  value={selectedEdgeObj.style?.strokeWidth || 2}
                  onChange={(e) =>
                    updateEdgeStyle({ strokeWidth: parseInt(e.target.value) })
                  }
                />
              </div>
            </>
          )}
        </div>
      )}

      <div
        ref={boardRef}
        className={cn(
          'flex-1 w-full h-full relative canvas-container overflow-hidden canvas-grid',
          isPanning
            ? 'cursor-grabbing'
            : isSpacePressed || activeTool === 'Pan'
              ? 'cursor-grab'
              : activeTool !== 'Select'
                ? 'cursor-crosshair'
                : '',
        )}
        style={{
          backgroundPosition: `${transform.x}px ${transform.y}px`,
          backgroundSize: `${28 * transform.scale}px ${28 * transform.scale}px`,
        }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          style={{
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
            {funnel.edges.map((e) => {
              const sourceNode = funnel.nodes.find((n) => n.id === e.source)
              const targetNode = funnel.nodes.find((n) => n.id === e.target)
              if (!sourceNode || !targetNode) return null
              return (
                <EdgeItemWrapper
                  key={e.id}
                  edge={e}
                  sourceNode={sourceNode}
                  targetNode={targetNode}
                  isSelected={selectedEdge === e.id}
                  store={ephemeralStore}
                  activeTool={activeTool}
                  edgeStyle={funnel.edgeStyle || 'curved'}
                  onSelect={(ev: any) => {
                    ev.stopPropagation()
                    if (latest.current.activeTool === 'Select') {
                      setSelectedEdge(e.id)
                      setSelectedNodes([])
                    }
                  }}
                />
              )
            })}
            <DrawingEdgeOverlay
              store={ephemeralStore}
              nodes={funnel.nodes}
              edgeStyle={funnel.edgeStyle || 'curved'}
            />
            {selectionBox &&
              (() => {
                const w = Math.abs(selectionBox.currentX - selectionBox.startX)
                const h = Math.abs(selectionBox.currentY - selectionBox.startY)
                const x = Math.min(selectionBox.startX, selectionBox.currentX)
                const y = Math.min(selectionBox.startY, selectionBox.currentY)
                return (
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="hsl(var(--primary) / 0.1)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2 / transform.scale}
                    rx={8}
                  />
                )
              })()}
            <GuidesOverlay store={ephemeralStore} scale={transform.scale} />
          </svg>
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {funnel.nodes.map((n) => (
              <NodeItemWrapper
                key={n.id}
                node={n}
                isSelected={selectedNodes.includes(n.id)}
                store={ephemeralStore}
                snapToGrid={snapToGrid}
                activeTool={activeTool}
                taskProgress={{ total: 0, completed: 0 }}
                onPointerDownAction={(shiftKey: boolean) =>
                  handleNodePointerDown(n.id, shiftKey)
                }
                onMove={(dx: number, dy: number) =>
                  ephemeralStore.setState({
                    dragState: { isDragging: true, dx, dy },
                  })
                }
                onMoveEnd={(dx: number, dy: number) => {
                  const s = ephemeralStore.dragState
                  ephemeralStore.setState({ dragState: null })
                  onChangeWithHistory({
                    ...funnel,
                    nodes: funnel.nodes.map((node) =>
                      selectedNodes.includes(node.id) || node.id === n.id
                        ? {
                            ...node,
                            x: node.x + (s?.dx ?? dx),
                            y: node.y + (s?.dy ?? dy),
                          }
                        : node,
                    ),
                  })
                }}
                onResize={(x: number, y: number, w: number, h: number) =>
                  ephemeralStore.setState({
                    resizingNode: { id: n.id, x, y, width: w, height: h },
                  })
                }
                onResizeEnd={(x: number, y: number, w: number, h: number) => {
                  ephemeralStore.setState({ resizingNode: null })
                  onChangeWithHistory({
                    ...funnel,
                    nodes: funnel.nodes.map((node) =>
                      node.id === n.id
                        ? { ...node, x, y, width: w, height: h }
                        : node,
                    ),
                  })
                }}
                onAddChild={() => handleAddChild(n.id)}
                onDelete={() => {
                  selectedNodes.includes(n.id)
                    ? setNodeToDelete('selected')
                    : setNodeToDelete(n.id)
                }}
                onOpenRightPanel={(tab: string) =>
                  setRightPanelState({ nodeId: n.id, tab })
                }
                onOpenSettings={() => setSettingsNodeId(n.id)}
                onToggleComplete={() =>
                  onChangeWithHistory({
                    ...funnel,
                    nodes: funnel.nodes.map((node) =>
                      node.id === n.id
                        ? {
                            ...node,
                            data: {
                              ...node.data,
                              isCompleted: !node.data.isCompleted,
                            },
                          }
                        : node,
                    ),
                  })
                }
                scale={transform.scale}
                onTextChange={(text: string) =>
                  onChangeWithHistory({
                    ...funnel,
                    nodes: funnel.nodes.map((node) =>
                      node.id === n.id
                        ? { ...node, data: { ...node.data, name: text } }
                        : node,
                    ),
                  })
                }
                onEdgeDragStart={handleEdgeDragStart}
                onDropResource={handleDropResource}
              />
            ))}
          </div>
        </div>
      </div>
      {rightPanelState &&
        funnel.nodes.find((n) => n.id === rightPanelState.nodeId) && (
          <RightPanel
            node={funnel.nodes.find((n) => n.id === rightPanelState.nodeId)!}
            funnel={funnel}
            defaultTab={rightPanelState.tab}
            hideHeader={hideHeader}
            onChange={(n) =>
              onChangeWithHistory({
                ...funnel,
                nodes: funnel.nodes.map((node) =>
                  node.id === n.id ? n : node,
                ),
              })
            }
            onClose={() => setRightPanelState(null)}
          />
        )}
      <NodeSettingsModal
        node={
          settingsNodeId
            ? funnel.nodes.find((n) => n.id === settingsNodeId) || null
            : null
        }
        isOpen={!!settingsNodeId}
        onClose={() => setSettingsNodeId(null)}
        onSave={(id, updates) => {
          onChangeWithHistory({
            ...funnel,
            nodes: funnel.nodes.map((n) =>
              n.id === id ? { ...n, data: { ...n.data, ...updates } } : n,
            ),
          })
          setSettingsNodeId(null)
          toast({ title: 'Configurações do nó salvas com sucesso.' })
        }}
      />
      <ConfirmDialog
        open={!!nodeToDelete}
        onOpenChange={(open) => !open && setNodeToDelete(null)}
        title="Excluir Elementos?"
        description="Esta ação removerá permanentemente os elementos selecionados do canvas. Deseja continuar?"
        confirmLabel="Excluir Elementos"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

