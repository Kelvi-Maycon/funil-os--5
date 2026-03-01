import { createStore } from './main'
import { Funnel } from '@/types'

export const mockFunnels: Funnel[] = [
  {
    id: 'f1',
    projectId: 'p1',
    folderId: 'ff1',
    name: 'Funil de Vendas VSL',
    status: 'Ativo',
    edgeStyle: 'curved',
    createdAt: new Date().toISOString(),
    nodes: [
      {
        id: 'n1',
        type: 'Ad',
        x: 50,
        y: 200,
        data: {
          name: 'Meta Ads',
          subtitle: 'Campanha de Conversão',
          linkedAssetIds: ['a1', 'a2'],
          linkedDocumentIds: ['d1'],
        },
      },
      {
        id: 'n2',
        type: 'LandingPage',
        x: 400,
        y: 200,
        data: {
          name: 'Página de Captura',
          subtitle: 'Opt-in Principal',
          linkedTaskIds: ['t1', 't2'],
          isTaskMode: true,
        },
      },
      {
        id: 'n3',
        type: 'VSL',
        x: 750,
        y: 200,
        data: {
          name: 'Vídeo de Vendas',
          subtitle: 'Página VSL Principal',
          retention: '62%',
          linkedDocumentIds: ['d2'],
          linkedTaskIds: ['t3'],
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  {
    id: 'f2',
    projectId: 'p2',
    folderId: null,
    name: 'Captação de Leads',
    status: 'Rascunho',
    edgeStyle: 'curved',
    createdAt: new Date().toISOString(),
    nodes: [],
    edges: [],
  },
]

export default createStore<Funnel[]>('funilos_funnels', mockFunnels)
