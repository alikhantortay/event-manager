'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EventItem } from '@/types/event';

const eventSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное'),
  description: z.string().optional(),
  date: z.string().refine((val) => {
    const selectedDate = new Date(val).getTime();
    return !isNaN(selectedDate);
  }, { message: 'Некорректная дата' }),
  category: z.enum(['Конференция', 'Вебинар', 'Встреча']),
  status: z.enum(['Запланировано', 'Завершено']),
});

export type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: EventItem | null;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export default function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          date: new Date(initialData.date).toISOString().slice(0, 16),
          category: initialData.category as any,
          status: initialData.status as any,
        }
      : {
          title: '',
          description: '',
          date: '',
          category: 'Конференция',
          status: 'Запланировано',
        },
  });

  const onFormSubmit = (data: EventFormData) => {
    onSubmit({
      ...data,
      date: new Date(data.date).toISOString(),
    });
  };

  const today = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 relative">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Название <span className="text-rose-500">*</span>
        </label>
        <input
          {...register('title')}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder:text-slate-400 transition-all font-medium shadow-sm"
          placeholder="Введите название мероприятия"
        />
        {errors.title && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Описание</label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder:text-slate-400 transition-all resize-none shadow-sm"
          placeholder="Краткое описание события..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Дата и время <span className="text-rose-500">*</span>
        </label>
        <input
          type="datetime-local"
          min={!initialData ? today : undefined}
          {...register('date')}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-900 transition-all shadow-sm"
        />
        {errors.date && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.date.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Категория</label>
          <select
            {...register('category')}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-900 appearance-none transition-all cursor-pointer shadow-sm hover:bg-slate-50"
          >
            <option value="Конференция">Конференция</option>
            <option value="Вебинар">Вебинар</option>
            <option value="Встреча">Встреча</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Статус</label>
          <select
            {...register('status')}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-900 appearance-none transition-all cursor-pointer shadow-sm hover:bg-slate-50"
          >
            <option value="Запланировано">Запланировано</option>
            <option value="Завершено">Завершено</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-black/5 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
        >
          {initialData ? 'Сохранить изменения' : 'Создать мероприятие'}
        </button>
      </div>
    </form>
  );
}

