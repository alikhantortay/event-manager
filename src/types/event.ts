export type EventCategory = 'Конференция' | 'Вебинар' | 'Встреча' | string;
export type EventStatus = 'Запланировано' | 'Завершено';

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  category: EventCategory;
  status: EventStatus;
  isFavorite?: boolean;
}
