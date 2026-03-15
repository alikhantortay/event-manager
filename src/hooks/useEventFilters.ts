import { useState, useMemo } from 'react';
import { EventItem, EventCategory, EventStatus } from '@/types/event';

export type SortOption = 'dateA' | 'dateD' | 'titleA' | 'titleD';

export function useEventFilters(events: EventItem[], itemsPerPage: number = 6) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('dateA');
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setSearch('');
    setFilterCategory('All');
    setFilterStatus('All');
    setSortBy('dateA');
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (category: EventCategory | 'All') => {
    setFilterCategory(category);
    setPage(1);
  };

  const handleStatusChange = (status: EventStatus | 'All') => {
    setFilterStatus(status);
    setPage(1);
  };

  const processedEvents = useMemo(() => {
    let result = [...events];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        (e.description && e.description.toLowerCase().includes(q))
      );
    }

    if (filterCategory !== 'All') {
      result = result.filter(e => e.category === filterCategory);
    }
    if (filterStatus !== 'All') {
      result = result.filter(e => e.status === filterStatus);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'dateA': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'dateD': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'titleA': return a.title.localeCompare(b.title);
        case 'titleD': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    return result;
  }, [events, search, filterCategory, filterStatus, sortBy]);

  const totalPages = Math.ceil(processedEvents.length / itemsPerPage) || 1;
  const paginatedEvents = processedEvents.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const checkPaginationAfterDelete = () => {
    if (paginatedEvents.length === 1 && page > 1) {
      setPage(p => p - 1);
    }
  };

  return {
    search,
    filterCategory,
    filterStatus,
    sortBy,
    page,
    totalPages,
    paginatedEvents,
    setSearch: handleSearchChange,
    setFilterCategory: handleCategoryChange,
    setFilterStatus: handleStatusChange,
    setSortBy,
    setPage,
    resetFilters,
    checkPaginationAfterDelete,
    hasActiveFilters: search !== '' || filterCategory !== 'All' || filterStatus !== 'All'
  };
}
