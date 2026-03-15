'use client';

import { useState } from 'react';
import { useEventStore } from '@/store/eventStore';
import { useEventFilters } from '@/hooks/useEventFilters';
import { EventItem } from '@/types/event';
import EventCard from '@/components/EventCard';
import EventForm, { EventFormData } from '@/components/EventForm';
import Modal from '@/components/Modal';
import { Search, Plus, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function Home() {
  const { events, addEvent, updateEvent, deleteEvent } = useEventStore();
  
  const {
    search,
    filterCategory,
    filterStatus,
    sortBy,
    page,
    totalPages,
    paginatedEvents,
    setSearch,
    setFilterCategory,
    setFilterStatus,
    setSortBy,
    setPage,
    resetFilters,
    checkPaginationAfterDelete,
    hasActiveFilters
  } = useEventFilters(events, 6);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFormSubmit = (data: EventFormData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
    } else {
      // Find the max numeric ID to create an incremental ID
      const maxId = events.reduce((max, event) => {
        const numId = parseInt(event.id);
        return !isNaN(numId) && numId > max ? numId : max;
      }, 0);
      
      const newId = (maxId + 1).toString();
      
      addEvent({ ...data, id: newId, isFavorite: false });
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
      checkPaginationAfterDelete();
    }
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ events }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "events.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">Мероприятия</h1>
          <p className="text-slate-500 text-sm mt-1">Управляйте всеми вашими событиями в одном месте</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToJson}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white/70 backdrop-blur-md border border-black/5 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer"
          >
            Экспорт JSON
          </button>
          <button
            onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-black/5 shadow-sm shadow-black/5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="py-2.5 pl-3 pr-8 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-slate-700 appearance-none transition-all cursor-pointer shadow-sm hover:bg-slate-50"
              >
                <option value="All">Все категории</option>
                <option value="Конференция">Конференция</option>
                <option value="Вебинар">Вебинар</option>
                <option value="Встреча">Встреча</option>
              </select>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="py-2.5 pl-3 pr-8 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-slate-700 appearance-none transition-all cursor-pointer shadow-sm hover:bg-slate-50"
            >
              <option value="All">Все статусы</option>
              <option value="Запланировано">Запланировано</option>
              <option value="Завершено">Завершено</option>
            </select>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 pl-3 pr-8 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 text-slate-700 appearance-none transition-all cursor-pointer shadow-sm hover:bg-slate-50"
              >
                <option value="dateA">Сначала старые</option>
                <option value="dateD">Сначала новые</option>
                <option value="titleA">От А до Я</option>
                <option value="titleD">От Я до А</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {paginatedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event: EventItem) => (
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
          <p className="text-slate-500 text-lg mb-2">Мероприятия не найдены</p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-700 hover:underline text-sm font-medium transition-colors"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all text-slate-700 shadow-sm"
          >
            Назад
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-800">{page}</span>
            <span className="text-sm text-slate-400">/</span>
            <span className="text-sm text-slate-600">{totalPages}</span>
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all text-slate-700 shadow-sm"
          >
            Вперед
          </button>
        </div>
      )}

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingEvent(null); }}
        title={editingEvent ? 'Редактировать мероприятие' : 'Новое мероприятие'}
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
