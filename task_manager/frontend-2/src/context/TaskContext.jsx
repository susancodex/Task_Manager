import { createContext, useContext, useState, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    ordering: '-created_at',
    page: 1,
  });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const merged = { ...filters, ...params };
      // Clean empty values
      const cleaned = Object.fromEntries(
        Object.entries(merged).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      const data = await getTasks(cleaned);
      // Handle both paginated and non-paginated responses
      if (data.results !== undefined) {
        setTasks(data.results);
        setPagination({ count: data.count, next: data.next, previous: data.previous });
      } else {
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const addTask = useCallback(async (taskData) => {
    const newTask = await createTask(taskData);
    toast.success('Task created!');
    return newTask;
  }, []);

  const editTask = useCallback(async (id, taskData) => {
    const updated = await updateTask(id, taskData);
    toast.success('Task updated!');
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await deleteTask(id);
    toast.success('Task deleted.');
  }, []);

  const toggleComplete = useCallback(async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updated = await updateTask(task.id, { ...task, status: newStatus });
    toast.success(newStatus === 'completed' ? 'Marked complete!' : 'Marked pending.');
    return updated;
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks, pagination, loading, filters,
      fetchTasks, addTask, editTask, removeTask, toggleComplete,
      updateFilters, setFilters,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
