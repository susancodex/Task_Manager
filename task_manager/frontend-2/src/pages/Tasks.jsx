import { useEffect, useState } from 'react';
import { Plus, SlidersHorizontal, ChevronLeft, ChevronRight, ListTodo } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/task/TaskCard';
import TaskModal from '../components/task/TaskModal';
import Spinner from '../components/common/Spinner';

const Tasks = () => {
  const { tasks, pagination, loading, fetchTasks, filters, updateFilters } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  const handlePage = (dir) => {
    const next = (filters.page || 1) + dir;
    updateFilters({ page: next });
  };

  const totalPages = pagination.count ? Math.ceil(pagination.count / 10) : 1;
  const currentPage = filters.page || 1;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Tasks</h1>
          <p className="text-sm text-ink-500 mt-0.5">
            {pagination.count !== undefined ? `${pagination.count} task${pagination.count !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`btn-secondary ${filtersOpen ? 'bg-ink-100 border-ink-300' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="card p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-slide-up">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Status</label>
            <select
              className="input-field"
              value={filters.status || ''}
              onChange={(e) => updateFilters({ status: e.target.value })}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Priority</label>
            <select
              className="input-field"
              value={filters.priority || ''}
              onChange={(e) => updateFilters({ priority: e.target.value })}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Sort By</label>
            <select
              className="input-field"
              value={filters.ordering || '-created_at'}
              onChange={(e) => updateFilters({ ordering: e.target.value })}
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="due_date">Due Date ↑</option>
              <option value="-due_date">Due Date ↓</option>
            </select>
          </div>
          <div className="col-span-full flex justify-end">
            <button
              className="text-xs text-ink-500 hover:text-ink-900 transition-colors"
              onClick={() => updateFilters({ status: '', priority: '', ordering: '-created_at' })}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-ink-400" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-ink-100 flex items-center justify-center mx-auto mb-4">
            <ListTodo className="w-7 h-7 text-ink-400" />
          </div>
          <p className="text-sm font-semibold text-ink-600">No tasks found</p>
          <p className="text-xs text-ink-400 mt-1 mb-4">
            {filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && tasks.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-ink-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => handlePage(-1)}
              disabled={!pagination.previous}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              className="btn-secondary"
              onClick={() => handlePage(1)}
              disabled={!pagination.next}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 sm:hidden w-12 h-12 rounded-full bg-ink-950 text-white shadow-lifted flex items-center justify-center hover:bg-ink-700 transition-colors active:scale-95"
      >
        <Plus className="w-5 h-5" />
      </button>

      <TaskModal isOpen={modalOpen} onClose={handleCloseModal} task={editTask} />
    </div>
  );
};

export default Tasks;
