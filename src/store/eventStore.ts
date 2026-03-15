import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EventItem } from '@/types/event';

interface EventStore {
  events: EventItem[];
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const initialEvents: EventItem[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Annual tech conference on AI and ML',
    date: '2025-05-15T10:00:00Z',
    category: 'Конференция',
    status: 'Запланировано',
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Team Meetup',
    description: 'Monthly team sync',
    date: '2025-04-30T14:00:00Z',
    category: 'Встреча',
    status: 'Завершено',
    isFavorite: true,
  }
];

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: initialEvents,
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updatedFields) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
          ),
        })),
    }),
    {
      name: 'event-storage',
    }
  )
);
