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
  MessageCircle,
  Square,
  Circle,
  Hexagon,
  ArrowRight,
  Minus as DashIcon,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
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

  drawingEdge: {
    source: string
    currentX: number
    currentY: number
  } | null = null

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
    ) {
      return prev
    }

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
  if (node.type === 'FloatingText') {
    const textLen = (node.data.name || '').length
    const approxW = Math.max(40, textLen * 8.5 + 16)
    return { x: x + approxW, y: y + 20 }
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
  if (style === 'straight') {
    return `M ${sourceCoords.x} ${sourceCoords.y} L ${targetCoords.x} ${targetCoords.y}`
  } else if (style === 'orthogonal') {
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
  }: {
    edge: Edge
    sourceNode: Node
    targetNode: Node
    isSelected: boolean
    activeTool: string
    edgeStyle: string
    onSelect: (e: React.PointerEvent) => void
  }) => {
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
      (isSelected ? 'hsl(var(--primary))' : 'url(#edge-gradient)')
    const strokeWidth = edge.style?.strokeWidth || (isSelected ? 4 : 3)
    const strokeDasharray = edge.style?.strokeDasharray || 'none'

    return (
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
    )
  },
  (prev, next) => {
    return (
      prev.edge === next.edge &&
      prev.sourceNode === next.sourceNode &&
      prev.targetNode === next.targetNode &&
      prev.isSelected === next.isSelected &&
      prev.activeTool === next.activeTool &&
      prev.edgeStyle === next.edgeStyle
    )
  },
)

const MemoizedNodeItem = memo(NodeItem, (prev, next) => {
  return (
    prev.node === next.node &&
    prev.selected === next.selected &&
    prev.snapToGrid === next.snapToGrid &&
    prev.activeTool === next.activeTool &&
    prev.isNodeDragging === next.isNodeDragging &&
    prev.taskProgress.total === next.taskProgress.total &&
    prev.taskProgress.completed === next.taskProgress.completed &&
    prev.scale === next.scale
  )
})

const NodeItemWrapper = memo(({ node, isSelected, store, ...props }: any) => {
  const { node: effNode, isNodeDragging } = useEphemeralNodeState(
    node,
    isSelected,
    store,
  )
  return (
    <MemoizedNodeItem
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
    isSourceSelected,
    isTargetSelected,
    store,
    activeTool,
    edgeStyle,
    onSelect,
  }: any) => {
    const { node: effSource } = useEphemeralNodeState(
      sourceNode,
      isSourceSelected,
      store,
    )
    const { node: effTarget } = useEphemeralNodeState(
      targetNode,
      isTargetSelected,
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

const DrawingEdgeOverlay = memo(
  ({
    store,
    nodes,
    edgeStyle,
  }: {
    store: CanvasEphemeralState
    nodes: Node[]
    edgeStyle: string
  }) => {
    const drawingEdge = useSyncExternalStore(
      store.subscribe,
      () => store.drawingEdge,
    )
    if (!drawingEdge) return null

    const sNode = nodes.find((n) => n.id === drawingEdge.source)
    if (!sNode) return null

    const sourceCoords = getRightPortCoords(sNode, sNode.x, sNode.y)
    const targetCoords = {
      x: drawingEdge.currentX,
      y: drawingEdge.currentY,
    }
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
  },
)

const GuidesOverlay = memo(
  ({ store, scale }: { store: CanvasEphemeralState; scale: number }) => {
    const guides = useSyncExternalStore(
      store.subscribe,
      () => store.dragState?.guides,
    )
    if (!guides || guides.length === 0) return null

    return (
      <>
        {guides.map((guide, idx) => (
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
  },
)

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

  const targetNodeId = searchParams.get('nodeId')
  useEffect(() => {
    if (targetNodeId && funnel.nodes.length > 0) {
      const node = funnel.nodes.find((n) => n.id === targetNodeId)
      if (node && boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect()
        setTransform({
          x: rect.width / 2 - node.x * 1.5 - 195,
          y: rect.height / 2 - node.y * 1.5 - 60,
          scale: 1.5,
        })
        setSelectedNodes([node.id])
        setRightPanelState({ nodeId: node.id, tab: 'details' })
        searchParams.delete('nodeId')
        setSearchParams(searchParams, { replace: true })
      }
    }
  }, [
    targetNodeId,
    funnel.nodes,
    searchParams,
    setSearchParams,
    setSelectedNodes,
    setTransform,
  ])

  const handleGroupSelected = useCallback(() => {
    const { funnel, selectedNodes } = latest.current
    if (selectedNodes.length < 2) return
    const groupId = generateId('g')
    onChangeWithHistory({
      ...funnel,
      nodes: funnel.nodes.map((n) =>
        selectedNodes.includes(n.id) ? { ...n, groupId } : n,
      ),
    })
    toast({ title: 'Elementos agrupados.' })
  }, [onChangeWithHistory, toast])

  const handleDeleteSelected = useCallback(() => {
    const { funnel, selectedNodes, rightPanelState, settingsNodeId } =
      latest.current
    if (selectedNodes.length === 0) return
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
  }, [onChangeWithHistory, setSelectedNodes])

  const handleConfirmDelete = useCallback(() => {
    const { funnel, rightPanelState, settingsNodeId } = latest.current
    if (nodeToDelete === 'selected') {
      handleDeleteSelected()
    } else if (nodeToDelete && nodeToDelete !== 'selected') {
      onChangeWithHistory({
        ...funnel,
        nodes: funnel.nodes.filter((x) => x.id !== nodeToDelete),
        edges: funnel.edges.filter(
          (e) => e.source !== nodeToDelete && e.target !== nodeToDelete,
        ),
      })
      if (rightPanelState?.nodeId === nodeToDelete) setRightPanelState(null)
      if (settingsNodeId === nodeToDelete) setSettingsNodeId(null)
    }
    setNodeToDelete(null)
  }, [nodeToDelete, handleDeleteSelected, onChangeWithHistory])

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
        case 'r':
          setActiveTool('Rectangle')
          break
        case 'o':
          setActiveTool('Ellipse')
          break
        case 'd':
          setActiveTool('Diamond')
          break
        case 'a':
          setActiveTool('Arrow')
          break
        case 'l':
          setActiveTool('Line')
          break
        case 'h':
          setActiveTool('Pan')
          break
        case 't':
          setActiveTool('Text')
          break
        case 'delete':
        case 'backspace':
          if (latest.current.selectedNodes.length > 0)
            setNodeToDelete('selected')
          break
        case 'g':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleGroupSelected()
          }
          break
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.shiftKey) {
              redo(latest.current.funnel, onChange)
            } else {
              undo(latest.current.funnel, onChange)
            }
          }
          break
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleGroupSelected, undo, redo, onChange])

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const { funnel, transform } = latest.current
          const newAsset: Resource = {
            id: generateId('a'),
            projectId: funnel.projectId,
            title: 'Pasted Image ' + format(new Date(), 'HH:mm:ss'),
            content:
              'https://img.usecurling.com/p/800/600?q=wireframe&color=gray',
            type: 'image',
            tags: ['pasted', 'canvas'],
            folderId: null,
            isPinned: false,
            createdAt: new Date().toISOString(),
          }
          setResources((prev) => [newAsset, ...prev])

          const newNode: Node = {
            id: generateId('n'),
            type: 'Image',
            x: -transform.x / transform.scale + 400,
            y: -transform.y / transform.scale + 200,
            data: {
              name: newAsset.content,
              status: '',
              subtitle: '',
              linkedAssetIds: [newAsset.id],
            },
          }
          onChangeWithHistory({ ...funnel, nodes: [...funnel.nodes, newNode] })
          setSelectedNodes([newNode.id])
          toast({ title: 'Imagem colada no canvas!' })
        }
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [setResources, onChangeWithHistory, setSelectedNodes, toast])

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

    const isMiddleClick = e.button === 1
    const isSpaceRightClick = isSpacePressed && e.button === 2

    if (activeTool === 'Pan' || isMiddleClick || isSpaceRightClick) {
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
          const bounds = getApproxBounds(n)
          return (
            bounds.x < maxX &&
            bounds.x + bounds.w > minX &&
            bounds.y < maxY &&
            bounds.y + bounds.h > minY
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
      const width = Math.abs(creatingShape.currentX - creatingShape.startX)
      const height = Math.abs(creatingShape.currentY - creatingShape.startY)
      const x = Math.min(creatingShape.startX, creatingShape.currentX)
      const y = Math.min(creatingShape.startY, creatingShape.currentY)

      if (width > 10 || height > 10) {
        const newNodeId = generateId('n')
        onChangeWithHistory({
          ...funnel,
          nodes: [
            ...funnel.nodes,
            {
              id: newNodeId,
              type: creatingShape.type,
              x,
              y,
              width: Math.max(width, 20),
              height: Math.max(height, 20),
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
        setSelectedNodes([newNodeId])
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
    const newNodeId = generateId('n')
    onChangeWithHistory({
      ...funnel,
      nodes: [
        ...funnel.nodes,
        {
          id: newNodeId,
          type,
          x,
          y,
          data: { name: type, status: 'A Fazer', subtitle: '+1 filter' },
        },
      ],
    })
    setSelectedNodes([newNodeId])
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
        const coords = getCoords(ev.clientX, ev.clientY)
        ephemeralStore.setState({
          drawingEdge: {
            source: nodeId,
            currentX: coords.x,
            currentY: coords.y,
          },
        })
      }
      const onUp = (ev: PointerEvent) => {
        const { funnel } = latest.current
        const coords = getCoords(ev.clientX, ev.clientY)

        let targetId: string | null = null
        const targetNodeEl = document
          .elementFromPoint(ev.clientX, ev.clientY)
          ?.closest('[data-node-id]')

        if (targetNodeEl) {
          targetId = targetNodeEl.getAttribute('data-node-id')
        }

        if (!targetId) {
          for (const n of funnel.nodes) {
            if (n.id === nodeId) continue
            const bounds = getApproxBounds(n)
            if (
              coords.x >= bounds.x &&
              coords.x <= bounds.x + bounds.w &&
              coords.y >= bounds.y &&
              coords.y <= bounds.y + bounds.h
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
            data: {
              name: 'New Step',
              status: 'A Fazer',
              subtitle: '+1 filter',
            },
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
    const newNodeId = generateId('n')
    onChangeWithHistory({
      ...funnel,
      nodes: [
        ...funnel.nodes,
        {
          id: newNodeId,
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
    setSelectedNodes([newNodeId])
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

      if (type === 'document')
        setDocs(
          docs.map((d) =>
            d.id === id ? { ...d, funnelId: funnel.id, nodeId } : d,
          ),
        )
      else if (type === 'task')
        setTasks(
          tasks.map((t) =>
            t.id === id ? { ...t, funnelId: funnel.id, nodeId } : t,
          ),
        )
      else if (type === 'asset')
        setResources(
          resources.map((a) =>
            a.id === id ? { ...a, projectId: funnel.projectId } : a,
          ),
        )
    },
    [onChangeWithHistory, setDocs, setTasks, setResources],
  )

  const updateEdgeStyle = (styleUpdates: Partial<Edge['style']>) => {
    if (selectedEdge) {
      onChangeWithHistory({
        ...funnel,
        edges: funnel.edges.map((e) =>
          e.id === selectedEdge
            ? { ...e, style: { ...e.style, ...styleUpdates } }
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
        else setSelectedNodes(groupMembers)
        setSelectedEdge(null)
      } else if (shiftKey) {
        setSelectedNodes(selectedNodes.filter((x) => !groupMembers.includes(x)))
      }
    },
    [setSelectedNodes, setSelectedEdge],
  )

  const canvasTools = [
    { id: 'Select', icon: MousePointer2, label: 'Cursor', key: '1' },
    { id: 'Pan', icon: Hand, label: 'Mão', key: 'H' },
    { id: 'divider1' },
    { id: 'Rectangle', icon: Square, label: 'Retângulo', key: 'R' },
    { id: 'Ellipse', icon: Circle, label: 'Elipse', key: 'O' },
    { id: 'Diamond', icon: Hexagon, label: 'Losango', key: 'D' },
    { id: 'Arrow', icon: ArrowRight, label: 'Seta', key: 'A' },
    { id: 'Line', icon: DashIcon, label: 'Linha', key: 'L' },
    { id: 'divider2' },
    {
      id: 'Text',
      icon: Type,
      label: 'Texto',
      key: 'T',
      action: () => handleAddAnnotation('Text', 'Add text here...'),
    },
    {
      id: 'Image',
      icon: ImageIcon,
      label: 'Imagem',
      action: () =>
        handleAddAnnotation(
          'Image',
          'https://img.usecurling.com/p/400/300?q=marketing',
        ),
    },
    { id: 'Chat', icon: MessageCircle, label: 'Comentário' },
  ]

  const isMultiSelect = selectedNodes.length > 1
  const selectedNodeObj =
    selectedNodes.length > 0
      ? funnel.nodes.find((n) => n.id === selectedNodes[0])
      : undefined
  const selectedEdgeObj = funnel.edges.find((e) => e.id === selectedEdge)

  const showPropertiesPanel =
    isMultiSelect ||
    selectedNodeObj ||
    selectedEdgeObj ||
    (selectedNodes.length === 0 && !selectedEdgeObj)

  const handleMinimapPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()

    const update = (clientX: number, clientY: number) => {
      const x = clientX - rect.left
      const y = clientY - rect.top
      const canvasX = x / 0.08
      const canvasY = y / 0.08
      const viewportW = boardRef.current?.clientWidth || 1000
      const viewportH = boardRef.current?.clientHeight || 800

      setTransform((prev) => ({
        ...prev,
        x: -(canvasX * prev.scale - viewportW / 2),
        y: -(canvasY * prev.scale - viewportH / 2),
      }))
    }

    update(e.clientX, e.clientY)

    const onMove = (ev: PointerEvent) => update(ev.clientX, ev.clientY)
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const minimapNodes = useMemo(() => {
    return funnel.nodes.map((n) => (
      <div
        key={n.id}
        className={cn(
          'absolute rounded-[12px] opacity-60',
          ['Square', 'Rectangle', 'Diamond', 'Circle', 'Ellipse'].includes(
            n.type,
          )
            ? 'bg-muted-foreground'
            : 'bg-primary/50',
        )}
        style={{
          left: n.x,
          top: n.y,
          width:
            n.width || (n.type === 'Text' || n.type === 'Image' ? 200 : 240),
          height: n.height || 100,
        }}
      />
    ))
  }, [funnel.nodes])

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
            <span className="bg-background text-primary px-2.5 py-1 rounded-[8px] text-[12px] font-bold border border-border">
              Publicado
            </span>
          </div>

          <div className="flex bg-background p-1 rounded-[8px] border border-border">
            <button className="px-4 py-1.5 rounded-[6px] bg-card text-primary text-[13px] font-bold shadow-sm">
              Editar
            </button>
            <button className="px-4 py-1.5 rounded-[6px] text-muted-foreground text-[13px] font-bold hover:text-foreground transition-colors">
              Analytics
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img
                src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1"
                className="w-8 h-8 rounded-full border-2 border-card shadow-sm"
                alt="Team 1"
              />
              <img
                src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2"
                className="w-8 h-8 rounded-full border-2 border-card shadow-sm"
                alt="Team 2"
              />
            </div>
            <Button className="font-bold shadow-sm">Exportar</Button>
          </div>
        </header>
      )}

      {/* Block Palette */}
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

      {/* Centralized Bottom Toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center p-2 bg-card rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-border z-40 gap-1">
        {canvasTools.map((t, idx) => {
          if (t.id.startsWith('divider'))
            return <div key={t.id} className="w-px h-6 bg-border mx-1" />
          return (
            <Tooltip key={t.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'w-10 h-10 rounded-[8px] transition-all relative',
                    activeTool === t.id &&
                      t.id !== 'Text' &&
                      t.id !== 'Image' &&
                      t.id !== 'Chat'
                      ? 'bg-primary/10 text-primary shadow-none'
                      : 'text-muted-foreground hover:text-primary hover:bg-sidebar',
                  )}
                  onClick={() =>
                    t.action ? t.action() : setActiveTool(t.id as any)
                  }
                >
                  {t.icon && <t.icon size={18} strokeWidth={2} />}
                  {t.key && t.id !== 'Pan' && t.id !== 'Select' && (
                    <span className="absolute bottom-1 right-1.5 text-[9px] font-bold opacity-60">
                      {t.key}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{t.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Zoom and Minimap toggles */}
      <div className="absolute right-6 bottom-6 flex items-center p-1.5 bg-card rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-border z-30 gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-[8px] text-muted-foreground hover:text-primary hover:bg-sidebar"
              onClick={zoomOut}
            >
              <Minus size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Hover Out</TooltipContent>
        </Tooltip>

        <button
          onClick={resetZoom}
          className="text-[12px] font-bold text-foreground h-8 min-w-[3rem] hover:text-primary transition-colors text-center"
        >
          {Math.round(transform.scale * 100)}%
        </button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-[8px] text-muted-foreground hover:text-primary hover:bg-sidebar"
              onClick={zoomIn}
            >
              <Plus size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Zoom In</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'w-10 h-10 rounded-[8px] text-muted-foreground hover:text-primary hover:bg-sidebar transition-colors',
                showMinimap && 'bg-primary/10 text-primary',
              )}
              onClick={() => setShowMinimap(!showMinimap)}
            >
              <MapIcon size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Minimap</TooltipContent>
        </Tooltip>
      </div>

      {showMinimap && (
        <div
          className="absolute right-6 bottom-[88px] transition-all duration-300 w-56 h-36 bg-card border border-border shadow-[0_4px_16px_rgba(0,0,0,0.08)] rounded-[12px] overflow-hidden z-30 cursor-crosshair"
          onPointerDown={handleMinimapPointerDown}
        >
          <div
            className="w-full h-full relative bg-background pointer-events-none"
            style={{ transform: 'scale(0.08)', transformOrigin: 'top left' }}
          >
            {minimapNodes}
            <div
              className="absolute border-[6px] border-primary bg-primary/10 rounded-[12px] pointer-events-none"
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

      {showPropertiesPanel && !rightPanelState && (
        <div
          className={cn(
            'absolute top-24 right-6 bg-card rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-border p-5 w-[280px] flex flex-col gap-6 z-40 transition-all max-h-[80vh] overflow-y-auto',
          )}
        >
          <div className="flex justify-between items-center">
            <h4 className="section-label">
              {isMultiSelect
                ? 'MÚLTIPLOS SELECIONADOS'
                : selectedNodeObj
                  ? selectedNodeObj.type === 'FloatingText' ||
                    selectedNodeObj.type === 'Text'
                    ? 'ESTILO DE TEXTO'
                    : [
                          'Square',
                          'Rectangle',
                          'Diamond',
                          'Circle',
                          'Ellipse',
                          'Arrow',
                          'Line',
                        ].includes(selectedNodeObj.type)
                      ? 'ESTILO DE FORMA'
                      : 'ESTILO DE NÓ'
                  : selectedEdgeObj
                    ? 'ESTILO DE LINHA'
                    : 'CANVAS'}
            </h4>
          </div>

          {!selectedNodeObj && !selectedEdgeObj && !isMultiSelect && (
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
                    <SelectItem value="curved">Curvo (Bezier)</SelectItem>
                    <SelectItem value="straight">Reto</SelectItem>
                    <SelectItem value="orthogonal">
                      Ortogonal (Degrau)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

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
                    'hsl(var(--foreground))',
                    'hsl(var(--primary))',
                    'hsl(var(--border))',
                    'hsl(var(--muted-foreground))',
                    'hsl(var(--success))',
                    'hsl(var(--warning))',
                    'hsl(var(--danger))',
                  ].map((c) => (
                    <button
                      key={c}
                      className={cn(
                        'w-7 h-7 rounded-[6px] border-[1.5px] transition-transform',
                        selectedNodeObj?.style?.fill === c ||
                          selectedNodeObj?.data?.color === c ||
                          (c === 'transparent' &&
                            !selectedNodeObj?.style?.fill &&
                            !selectedNodeObj?.data?.color)
                          ? 'border-foreground scale-110'
                          : 'border-transparent hover:scale-110 shadow-sm',
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
                        if (isMultiSelect) {
                          onChangeWithHistory({
                            ...funnel,
                            nodes: funnel.nodes.map((n) =>
                              selectedNodes.includes(n.id)
                                ? {
                                    ...n,
                                    style: { ...n.style, fill: c },
                                    data: {
                                      ...n.data,
                                      color:
                                        c === 'transparent' ? undefined : c,
                                    },
                                  }
                                : n,
                            ),
                          })
                        } else if (selectedNodeObj) {
                          updateNodeStyle({ fill: c })
                          // also update node color for step nodes
                          onChangeWithHistory({
                            ...funnel,
                            nodes: funnel.nodes.map((n) =>
                              n.id === selectedNodeObj.id
                                ? {
                                    ...n,
                                    data: {
                                      ...n.data,
                                      color:
                                        c === 'transparent' ? undefined : c,
                                    },
                                  }
                                : n,
                            ),
                          })
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="section-label block">
                  Cor do Contorno / Texto
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'hsl(var(--foreground))',
                    'hsl(var(--primary))',
                    'hsl(var(--muted-foreground))',
                    'hsl(var(--success))',
                    'hsl(var(--warning))',
                    'hsl(var(--danger))',
                  ].map((c) => (
                    <button
                      key={`stroke-${c}`}
                      className={cn(
                        'w-7 h-7 rounded-[6px] border-[1.5px] transition-transform shadow-sm',
                        selectedNodeObj?.style?.stroke === c ||
                          selectedNodeObj?.style?.color === c
                          ? 'border-foreground scale-110'
                          : 'border-transparent hover:scale-110',
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => {
                        updateNodeStyle({ stroke: c, color: c })
                      }}
                    />
                  ))}
                </div>
              </div>

              {isMultiSelect && (
                <Button
                  variant="destructive"
                  onClick={() => setNodeToDelete('selected')}
                  className="w-full mt-2"
                >
                  <Trash2 size={16} className="mr-2" /> Excluir Seleção
                </Button>
              )}
            </>
          )}

          {selectedEdgeObj && (
            <>
              <div className="space-y-3">
                <label className="section-label block">Estilo da Linha</label>
                <div className="flex gap-2">
                  <button
                    className={cn(
                      'flex-1 h-9 rounded-[8px] border-[1.5px] flex items-center justify-center transition-colors',
                      selectedEdgeObj.style?.strokeDasharray === 'none' ||
                        !selectedEdgeObj.style?.strokeDasharray
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground',
                    )}
                    onClick={() => updateEdgeStyle({ strokeDasharray: 'none' })}
                  >
                    <svg width="24" height="2" className="overflow-visible">
                      <line
                        x1="0"
                        y1="1"
                        x2="24"
                        y2="1"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </button>
                  <button
                    className={cn(
                      'flex-1 h-9 rounded-[8px] border-[1.5px] flex items-center justify-center transition-colors',
                      selectedEdgeObj.style?.strokeDasharray === '8 8'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground',
                    )}
                    onClick={() => updateEdgeStyle({ strokeDasharray: '8 8' })}
                  >
                    <svg width="24" height="2" className="overflow-visible">
                      <line
                        x1="0"
                        y1="1"
                        x2="24"
                        y2="1"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="section-label block">Espessura</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    className="flex-1 accent-primary h-1.5 bg-border rounded-full appearance-none cursor-pointer"
                    value={selectedEdgeObj.style?.strokeWidth || 2}
                    onChange={(e) =>
                      updateEdgeStyle({ strokeWidth: parseInt(e.target.value) })
                    }
                  />
                  <span className="text-[13px] font-bold text-foreground w-4 text-center">
                    {selectedEdgeObj.style?.strokeWidth || 2}
                  </span>
                </div>
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
        onDoubleClick={(e) => {
          const target = e.target as HTMLElement
          const isBg =
            target === boardRef.current ||
            target.classList.contains('canvas-container') ||
            target.tagName === 'svg'

          if (isBg && activeTool === 'Select') {
            const rect = boardRef.current?.getBoundingClientRect()
            if (!rect) return
            let x = (e.clientX - rect.left - transform.x) / transform.scale - 50
            let y = (e.clientY - rect.top - transform.y) / transform.scale - 15
            if (snapToGrid) {
              x = Math.round(x / 28) * 28
              y = Math.round(y / 28) * 28
            }
            const newNodeId = generateId('n')
            onChangeWithHistory({
              ...funnel,
              nodes: [
                ...funnel.nodes,
                {
                  id: newNodeId,
                  type: 'FloatingText',
                  x,
                  y,
                  data: { name: 'New Text', status: '', subtitle: '' },
                  style: { color: 'hsl(var(--foreground))' },
                },
              ],
            })
            setSelectedNodes([newNodeId])
          }
        }}
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
            <defs>
              <linearGradient
                id="edge-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--muted-foreground))" />
              </linearGradient>
              <filter
                id="roughpaper"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.04"
                  result="noise"
                  numOctaves="3"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="3"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            {funnel.edges.map((e) => {
              const sourceNode = funnel.nodes.find((n) => n.id === e.source)
              const targetNode = funnel.nodes.find((n) => n.id === e.target)
              if (!sourceNode || !targetNode) return null
              const isSelected = selectedEdge === e.id
              const isSourceSelected = selectedNodes.includes(e.source)
              const isTargetSelected = selectedNodes.includes(e.target)

              return (
                <EdgeItemWrapper
                  key={e.id}
                  edge={e}
                  sourceNode={sourceNode}
                  targetNode={targetNode}
                  isSelected={isSelected}
                  isSourceSelected={isSourceSelected}
                  isTargetSelected={isTargetSelected}
                  activeTool={activeTool}
                  edgeStyle={funnel.edgeStyle || 'curved'}
                  store={ephemeralStore}
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

            {/* Drawing edge */}
            <DrawingEdgeOverlay
              store={ephemeralStore}
              nodes={funnel.nodes}
              edgeStyle={funnel.edgeStyle || 'curved'}
            />

            {/* Selection Marquee */}
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
                    fill="rgba(192, 120, 72, 0.1)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2 / transform.scale}
                    rx={8}
                  />
                )
              })()}

            {/* Snapping Guides */}
            <GuidesOverlay store={ephemeralStore} scale={transform.scale} />
          </svg>

          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {funnel.nodes.map((n) => {
              const nodeTasks = tasks.filter((t) =>
                n.data.linkedTaskIds?.includes(t.id),
              )
              let total = 0
              let completed = 0
              nodeTasks.forEach((t) => {
                if (t.subtasks && t.subtasks.length > 0) {
                  total += t.subtasks.length
                  completed += t.subtasks.filter((s) => s.isCompleted).length
                } else {
                  total += 1
                  if (t.status === 'Concluído') completed += 1
                }
              })
              const taskProgress = { total, completed }

              return (
                <NodeItemWrapper
                  key={n.id}
                  node={n}
                  isSelected={selectedNodes.includes(n.id)}
                  store={ephemeralStore}
                  snapToGrid={snapToGrid}
                  activeTool={activeTool}
                  taskProgress={taskProgress}
                  onPointerDownAction={(shiftKey: boolean) =>
                    handleNodePointerDown(n.id, shiftKey)
                  }
                  onMove={(dx: number, dy: number) => {
                    let snapDx = dx
                    let snapDy = dy
                    let newGuides: {
                      x1: number
                      y1: number
                      x2: number
                      y2: number
                    }[] = []
                    const threshold = 8 / transform.scale

                    if (
                      selectedNodes.length === 1 &&
                      !isSpacePressed &&
                      !isPanning &&
                      snapToGrid
                    ) {
                      const activeNode = latest.current.funnel.nodes.find(
                        (node) => node.id === selectedNodes[0],
                      )
                      if (activeNode) {
                        const newX = activeNode.x + dx
                        const newY = activeNode.y + dy
                        const activeW = activeNode.width || 240
                        const activeH = activeNode.height || 120
                        const activeCx = newX + activeW / 2
                        const activeCy = newY + activeH / 2

                        for (const other of latest.current.funnel.nodes) {
                          if (other.id === activeNode.id) continue
                          const otherW = other.width || 240
                          const otherH = other.height || 120
                          const otherCx = other.x + otherW / 2
                          const otherCy = other.y + otherH / 2

                          if (Math.abs(activeCx - otherCx) < threshold) {
                            snapDx = otherCx - activeW / 2 - activeNode.x
                            newGuides.push({
                              x1: otherCx,
                              y1: Math.min(newY, other.y) - 500,
                              x2: otherCx,
                              y2: Math.max(newY, other.y) + 500,
                            })
                          }
                          if (Math.abs(activeCy - otherCy) < threshold) {
                            snapDy = otherCy - activeH / 2 - activeNode.y
                            newGuides.push({
                              x1: Math.min(newX, other.x) - 500,
                              y1: otherCy,
                              x2: Math.max(newX, other.x) + 500,
                              y2: otherCy,
                            })
                          }
                        }
                      }
                    }
                    ephemeralStore.setState({
                      dragState: {
                        isDragging: true,
                        dx: snapDx,
                        dy: snapDy,
                        guides: newGuides,
                      },
                    })
                  }}
                  onMoveEnd={(dx: number, dy: number) => {
                    const { funnel, selectedNodes } = latest.current
                    const dragState = ephemeralStore.dragState
                    const finalDx = dragState?.dx ?? dx
                    const finalDy = dragState?.dy ?? dy
                    ephemeralStore.setState({ dragState: null })
                    if (finalDx === 0 && finalDy === 0) return
                    onChangeWithHistory({
                      ...funnel,
                      nodes: funnel.nodes.map((node) =>
                        selectedNodes.includes(node.id) || node.id === n.id
                          ? {
                              ...node,
                              x: node.x + finalDx,
                              y: node.y + finalDy,
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
                    const { funnel } = latest.current
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
                    const { selectedNodes } = latest.current
                    if (selectedNodes.includes(n.id))
                      setNodeToDelete('selected')
                    else setNodeToDelete(n.id)
                  }}
                  onOpenRightPanel={(tab: string) =>
                    setRightPanelState({ nodeId: n.id, tab })
                  }
                  onOpenSettings={() => setSettingsNodeId(n.id)}
                  onToggleComplete={() => {
                    const { funnel } = latest.current
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
                  }}
                  scale={transform.scale}
                  onTextChange={(text: string) => {
                    const { funnel } = latest.current
                    onChangeWithHistory({
                      ...funnel,
                      nodes: funnel.nodes.map((node) =>
                        node.id === n.id
                          ? { ...node, data: { ...node.data, name: text } }
                          : node,
                      ),
                    })
                  }}
                  onEdgeDragStart={handleEdgeDragStart}
                  onDropResource={handleDropResource}
                />
              )
            })}
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
        }}
      />

      <ConfirmDialog
        open={!!nodeToDelete}
        onOpenChange={(open) => !open && setNodeToDelete(null)}
        title="Excluir Elementos?"
        description="Esta ação removerá os elementos selecionados do canvas. Deseja continuar?"
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
