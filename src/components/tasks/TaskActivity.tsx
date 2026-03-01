import { Task } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TaskActivity({ task }: { task: Task }) {
  const mockActivity = [
    {
      id: 'hist1',
      type: 'history',
      author: task.assignee || 'Sistema',
      action: 'criou a tarefa',
      date: task.deadline
        ? new Date(new Date(task.deadline).getTime() - 86400000).toISOString()
        : new Date().toISOString(),
    },
    ...(task.comments || []).map((c) => ({
      type: 'comment',
      date: c.createdAt,
      ...c,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C7B6C] mb-5 block">
        Atividade
      </label>
      <div className="relative pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-[#E8E2D9] space-y-6">
        {mockActivity.map((item: any) => (
          <div key={item.id} className="relative flex gap-4">
            {item.type === 'history' ? (
              <>
                <div className="absolute -left-[30px] top-1.5 w-[14px] h-[14px] rounded-full bg-[#E8E2D9] border-[3px] border-[#FAF7F2] z-10" />
                <div className="text-[13px] pt-0.5">
                  <span className="font-semibold text-[#3D2B1F]">
                    {item.author}
                  </span>
                  <span className="text-[#8C7B6C] ml-1">{item.action}</span>
                  <span className="text-[11px] text-[#8C7B6C] ml-2 font-medium">
                    {format(new Date(item.date), 'dd MMM, HH:mm', {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute -left-9 top-0 z-10">
                  <Avatar className="w-7 h-7 border-2 border-[#FAF7F2]">
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback className="bg-[#F3EEE7] text-[#C2714F] text-[10px] font-bold">
                      {item.author?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="bg-[#F3EEE7] px-4 py-3 rounded-2xl rounded-tl-none text-[13px] text-[#3D2B1F] italic leading-relaxed">
                    "{item.content}"
                  </div>
                  <div className="text-[11px] text-[#8C7B6C] font-medium mt-1.5 ml-1">
                    {format(new Date(item.date), "dd 'de' MMM, HH:mm", {
                      locale: ptBR,
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
