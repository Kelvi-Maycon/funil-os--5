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
    iconColor: 'text-primary',
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
    iconColor: 'text-primary',
    blocks: [{ type: 'WaitUntil', icon: Clock, label: 'Wait Until' }],
  },
  {
    title: 'PAGES',
    iconColor: 'text-primary',
    blocks: [
      { type: 'LandingPage', icon: LayoutTemplate, label: 'Landing Page' },
      { type: 'VSL', icon: PlayCircle, label: 'VSL Page' },
      { type: 'Checkout', icon: CreditCard, label: 'Checkout' },
      { type: 'Upsell', icon: ArrowUpCircle, label: 'Upsell' },
      { type: 'Obrigado', icon: CheckCircle, label: 'Thank You' },
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
    <div className="w-[260px] max-h-[calc(100vh-140px)] bg-card rounded-2xl border border-border shadow-[0_4px_24px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 no-scrollbar space-y-8">
        {BLOCK_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div
                className={`w-2 h-2 rotate-45 bg-current ${cat.iconColor}`}
              />
              <h4 className="section-label">{cat.title}</h4>
            </div>
            <div className="flex flex-col gap-1">
              {cat.blocks.map((block) => (
                <div
                  key={block.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, block.type)}
                  className="flex items-center gap-4 p-3 hover:bg-background rounded-xl cursor-grab active:cursor-grabbing transition-colors text-foreground border border-transparent hover:border-border"
                >
                  <block.icon
                    size={18}
                    className="text-muted-foreground shrink-0"
                    strokeWidth={2}
                  />
                  <span className="text-[14px] font-bold truncate">
                    {block.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
