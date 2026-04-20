import { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useDebounce } from './useDebounce';

export const useTaskFilters = () => {
  const { fetchTasks, updateFilters, filters } = useTasks();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  return { searchInput, setSearchInput };
};
