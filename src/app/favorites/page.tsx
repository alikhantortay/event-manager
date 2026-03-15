'use client';

import { useEventStore } from '@/store/eventStore';
import EventCard from '@/components/EventCard';
import Modal from '@/components/Modal';
import { useState } from 'react';
import { EventItem } from '@/types/event';
import EventForm, { EventFormData } from '@/components/EventForm';

export default function FavoritesPage() {
  const { events, updateEvent, deleteEvent } = useEventStore();
  
  const favoriteEvents = events.filter(e => e.isFavorite);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFormSubmit = (data: EventFormData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleEdit = (ev: EventItem) => {
    setEditingEvent(ev);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteEvent(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">Избранное</h1>
        <p className="text-slate-500 text-sm mt-1">Отмеченные вами мероприятия</p>
      </div>

      {favoriteEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={handleEdit}
              onDeleteStart={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 border border-slate-200 rounded-2xl border-dashed backdrop-blur-sm">
          <p className="text-slate-500 text-lg">У вас пока нет избранных мероприятий</p>
          <p className="text-slate-400 text-sm mt-2">Нажмите на сердечко на карточке события, чтобы добавить его сюда.</p>
        </div>
      )}

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingEvent(null); }}
        title="Редактировать мероприятие"
      >
        <EventForm 
          initialData={editingEvent}
          onSubmit={handleFormSubmit}
          onCancel={() => { setIsFormOpen(false); setEditingEvent(null); }}
        />
      </Modal>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Удалить мероприятие?"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">Вы уверены, что хотите удалить это мероприятие? Это действие нельзя отменить.</p>
          <div className="flex justify-end gap-3 pt-6 border-t border-black/5 mt-2">
            <button
              onClick={() => setDeletingId(null)}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              Отмена
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-xl hover:from-rose-600 hover:to-red-700 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all hover:-translate-y-0.5"
            >
              Удалить
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
