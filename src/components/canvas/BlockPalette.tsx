import React from 'react'
import {
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  Smartphone,
  Clock,
  LayoutTemplate,
  CreditCard,
  ArrowUpCircle,
  CheckCircle,
  FileText,
  Megaphone,
  PlayCircle,
} from 'lucide-react'
import { Funnel } from '@/types'

const BLOCK_CATEGORIES = [
  {
    title: 'MESSAGES',
    blocks: [
      { type: 'Email', icon: Mail, label: 'Email' },
      { type: 'Slack', icon: MessageSquare, label: 'Slack' },
      { type: 'SMS', icon: MessageCircle, label: 'SMS' },
      { type: 'WhatsApp', icon: Phone, label: 'WATI (WhatsApp)' },
      { type: 'ManyChat', icon: Smartphone, label: 'ManyChat (WhatsApp)' },
    ],
  },
  {
    title: 'DELAYS',
    blocks: [{ type: 'Wait', icon: Clock, label: 'Wait Until' }],
  },
  {
    title: 'PAGES',
    blocks: [
      { type: 'LandingPage', icon: LayoutTemplate, label: 'Landing Page' },
      { type: 'VSL', icon: PlayCircle, label: 'VSL Page' },
      { type: 'Checkout', icon: CreditCard, label: 'Checkout' },
      { type: 'Upsell', icon: ArrowUpCircle, label: 'Upsell' },
      { type: 'ThankYou', icon: CheckCircle, label: 'Thank You' },
      { type: 'Form', icon: FileText, label: 'Form' },
      { type: 'Ad', icon: Megaphone, label: 'Ad Campaign' },
    ],
  },
]

export default function BlockPalette({ funnel }: { funnel: Funnel }) {
  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('blockType', type)
  }

  return (
    <div className="block-palette w-[240px] max-h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      <div className="p-4 pb-2 border-b border-border">
        <h3 className="text-caption font-semibold">Blocos</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 no-scrollbar space-y-5">
        {BLOCK_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-current text-[hsl(var(--brand))]" />
              <span className="text-label">{cat.title}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {cat.blocks.map((block) => (
                <div
                  key={block.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, block.type)}
                  className="block-palette-item"
                >
                  <block.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{block.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
