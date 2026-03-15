'use client';

import { EventItem } from '@/types/event';
import { useEventStore } from '@/store/eventStore';
import { format } from 'date-fns';
import { Calendar, Trash2, Edit2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDeleteStart: (id: string) => void;
}

export default function EventCard({ event, onEdit, onDeleteStart }: EventCardProps) {
  const toggleFavorite = useEventStore(state => state.toggleFavorite);

  return (
    <div className="group relative bg-white/70 backdrop-blur-xl border border-black/5 rounded-2xl p-6 flex flex-col h-full hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-3 border",
            event.category === 'Конференция' ? 'bg-purple-100/50 text-purple-700 border-purple-200' :
            event.category === 'Вебинар' ? 'bg-blue-100/50 text-blue-700 border-blue-200' :
            event.category === 'Встреча' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' :
            'bg-zinc-100/50 text-zinc-700 border-zinc-200'
          )}>
            {event.category}
          </span>
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
            {event.title}
          </h3>
        </div>
        <button
          onClick={() => toggleFavorite(event.id)}
          className="p-2 -mr-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-300 active:scale-95 rounded-full cursor-pointer"
        >
          <Heart className={cn("w-5 h-5 transition-all", event.isFavorite && "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]")} />
        </button>
      </div>

      <p className="text-zinc-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed font-medium">
        {event.description || 'Описание отсутствует'}
      </p>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>{format(new Date(event.date), 'dd.MM.yyyy HH:mm')}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-black/5 relative z-10">
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wider flex items-center gap-2",
            event.status === 'Запланировано' ? 'text-indigo-600' : 'text-zinc-500'
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              event.status === 'Запланировано' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse' : 'bg-zinc-400'
            )} />
            {event.status}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Редактировать"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteStart(event.id)}
              className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
